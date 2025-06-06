const express = require("express");
const { spawn } = require("child_process");
const axios = require("axios");
const GetArticles = require("../GetArticles");
const { authenticateToken } = require("../middleware/auth");
const path = require("path");
const fs = require("fs");
const ChatHistory = require("../models/ChatHistory");

const router = express.Router();

// Process chatbot queries
router.post("/query", authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id; // Assumes authenticateToken sets req.user.id

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    // Save user message to chat history
    let chatHistory = await ChatHistory.findOne({ userId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ userId, messages: [] });
    }
    chatHistory.messages.push({ role: "user", message: query });
    await chatHistory.save();

    // Step 1: Try to get topic from query, fallback to original query if extraction fails
    let topics;
    try {
      topics = await executePythonScript(query);
    } catch (error) {
      console.error("Python script error:", error.message);
      // If topic extraction fails, use the original query as a fallback
      topics = [query];
    }

    if (!topics || topics.length === 0) {
      topics = [query]; // Use original query as fallback
    }

    console.log("Using topics:", topics);

    // Step 2: Get articles for each topic
    let allArticles = [];
    for (const topic of topics) {
      try {
        const articles = await GetArticles(topic);
        if (articles && articles.length > 0) {
          // Only take the top 3 articles for summarization
          allArticles = [...allArticles, ...articles.slice(0, 3)];
        }
      } catch (topicError) {
        console.error(
          `Error fetching articles for topic "${topic}":`,
          topicError
        );
        // Continue with next topic
      }
    }

    if (allArticles.length === 0) {
      return res
        .status(404)
        .json({ message: "No articles found for the given query" });
    }

    // Step 3: Extract article contents for summarization
    const articlesContent = allArticles.map((article) => article.content);

    // Check for follow-up Q/A: if the last bot message has articles and summary, and the user query looks like a question
    const lastBotMsg = chatHistory.messages
      .slice()
      .reverse()
      .find((m) => m.role === "bot" && m.articles && m.summary);
    const isFollowUp = lastBotMsg && /\?$/.test(query.trim());
    if (isFollowUp) {
      // Call FastAPI /answer endpoint
      const qaRequest = {
        articles: lastBotMsg.articles,
        summary: lastBotMsg.summary,
        question: query,
        domain: topics[0] || "",
      };
      try {
        const answerResponse = await axios.post(
          "http://localhost:8000/answer",
          qaRequest,
          {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
          }
        );
        chatHistory.messages.push({
          role: "bot",
          message: answerResponse.data.answer,
        });
        await chatHistory.save();
        const lastMessages = chatHistory.messages.slice(-10);
        return res.json({
          answer: answerResponse.data.answer,
          topics,
          articleCount: allArticles.length,
          chatHistory: lastMessages,
        });
      } catch (qaError) {
        console.error("Q/A error:", qaError.message);
        if (qaError.response) {
          console.error("Q/A response status:", qaError.response.status);
          console.error("Q/A response data:", qaError.response.data);
        }
        // Fallback to normal summary flow if Q/A fails
      }
    }

    // Step 4: Send to FastAPI for summarization with the exact expected structure
    try {
      // Clean the query string to remove extra spaces
      const cleanedQuery = query.trim();

      // Format the request data exactly as expected by FastAPI
      const requestData = {
        articles: articlesContent.map((content) => content.trim()), // Trim all article contents
        domain: cleanedQuery, // Use cleaned query
      };

      console.log("Sending data to FastAPI:", {
        articleCount: requestData.articles.length,
        domain: requestData.domain,
        // Log first few characters of first article for debugging
        sampleContent: requestData.articles[0]?.substring(0, 50) + "...",
      });

      try {
        const summaryResponse = await axios.post(
          "http://localhost:8000/summarize",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            // Add timeout to prevent hanging
            timeout: 15000,
          }
        );

        // Save bot response to chat history, including articles and summary for follow-up Q&A
        chatHistory.messages.push({
          role: "bot",
          message: summaryResponse.data.summary,
          articles: articlesContent, // Store articles for follow-up
          summary: summaryResponse.data.summary, // Store summary for follow-up
        });
        await chatHistory.save();
        const lastMessages = chatHistory.messages.slice(-10);

        // Return the summarized content
        return res.json({
          summary: summaryResponse.data.summary,
          topics,
          articleCount: allArticles.length,
          chatHistory: lastMessages,
        });
      } catch (summaryError) {
        console.error("Error details:", summaryError.message);
        if (summaryError.response) {
          console.error("Response status:", summaryError.response.status);
          console.error("Response data:", summaryError.response.data);
        }

        // Create a basic summary as fallback
        const fallbackSummary = `I found ${
          allArticles.length
        } articles about "${query}". Here are some headlines: ${allArticles
          .slice(0, 3)
          .map((a) => a.title)
          .join("; ")}...`;

        chatHistory.messages.push({ role: "bot", message: fallbackSummary });
        await chatHistory.save();
        const lastMessages = chatHistory.messages.slice(-10);

        return res.json({
          summary: fallbackSummary,
          topics,
          articleCount: allArticles.length,
          error: "Could not generate detailed summary",
          chatHistory: lastMessages,
        });
      }
    } catch (error) {
      console.error("Error getting summary from FastAPI:", error.message);
      // Create a basic summary as fallback
      const fallbackSummary = `I found ${
        allArticles.length
      } articles about "${query}". Here are some headlines: ${allArticles
        .slice(0, 3)
        .map((a) => a.title)
        .join("; ")}...`;

      chatHistory.messages.push({ role: "bot", message: fallbackSummary });
      await chatHistory.save();
      const lastMessages = chatHistory.messages.slice(-10);

      return res.json({
        summary: fallbackSummary,
        topics,
        articleCount: allArticles.length,
        error: "Could not generate detailed summary",
        chatHistory: lastMessages,
      });
    }
  } catch (error) {
    console.error("Error processing chatbot query:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Execute Python script to extract topics from query
function executePythonScript(query) {
  return new Promise((resolve, reject) => {
    // Check both potential paths for extract.py
    const extractPaths = [
      path.join(__dirname, "..", "extract.py"),
      path.join(__dirname, "..", "..", "fastapi", "app", "extract.py"),
    ];

    // Find the first path that exists
    let extractPath = null;
    for (const potentialPath of extractPaths) {
      if (fs.existsSync(potentialPath)) {
        extractPath = potentialPath;
        break;
      }
    }

    if (!extractPath) {
      console.error("Could not find extract.py file");
      return resolve([query]); // Return original query if we can't find the script
    }

    console.log("Using extract.py at:", extractPath);

    // Pass the query as command line argument
    const pythonProcess = spawn("python", [extractPath, query]);

    let outputData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      // Handle any code, even if it's an error code
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        console.error(`Error output: ${errorData}`);
        // Don't reject - just use whatever output we got, or fall back to the query
        if (outputData.trim()) {
          try {
            const result = outputData
              .trim()
              .split(",")
              .map((t) => t.trim());
            return resolve(result);
          } catch (e) {
            return resolve([outputData.trim()]);
          }
        }
        return resolve([query]);
      }

      try {
        // Parse the output to get topics
        const output = outputData.trim();
        if (!output) {
          return resolve([query]); // Use original query if no output
        }

        // Check if the output is JSON
        if (output.startsWith("[") && output.endsWith("]")) {
          const parsed = JSON.parse(output);
          return resolve(parsed);
        } else {
          // Otherwise, split by comma
          const topics = output.split(",").map((t) => t.trim());
          return resolve(topics);
        }
      } catch (error) {
        console.error("Error parsing Python script output:", error);
        // If parsing fails, use the raw output
        return resolve([outputData.trim() || query]);
      }
    });
  });
}

module.exports = router;
