const axios = require('axios');
// Modified require to include VirtualConsole
const { JSDOM, VirtualConsole } = require('jsdom');
const { Readability } = require('@mozilla/readability');
// const readlineSync = require('readline-sync');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const API_KEY = process.env.NEWS_API_KEY; // Your GNews API key

// Function to fetch articles from GNews API
async function fetchArticles(params) {
  try {
    const response = await axios.get('https://gnews.io/api/v4/search', { params });
    return response.data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error.response ? error.response.data : error.message);
    return [];
  }
}

// Modified extractArticleContent function to suppress CSS errors via VirtualConsole
async function extractArticleContent(url) {
  try {
    const response = await axios.get(url);
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", () => {}); // Ignore jsdom errors (e.g., CSS parsing errors)
    const dom = new JSDOM(response.data, { url, virtualConsole });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (article) {
      // Try to get image URL from meta tag or fallback to first image
      const metaImage = dom.window.document.querySelector('meta[property="og:image"]');
      const imgElement = dom.window.document.querySelector('img');
      const imageUrl = (metaImage && metaImage.getAttribute("content")) || (imgElement && imgElement.src) || null;
      return { textContent: article.textContent, imageUrl };
    }
    return { textContent: 'Content could not be extracted.', imageUrl: null };
  } catch (error) {
    console.error('Error fetching full article content:', error.message);
    return { textContent: 'Content could not be extracted.', imageUrl: null };
  }
}

// Main function to run the script
async function GetArticles(topic) {
  const maxArticles = 10; // Default to 10 articles

  const params = {
    token: API_KEY,
    lang: 'en',
    max: maxArticles,
    sortby: 'publishedAt',
    q: topic,
    country: 'in',
    page: Math.floor(Math.random() * 5) + 1,
  };

  const articles = await fetchArticles(params);

  if (articles.length === 0) {
    console.log('No articles found.');
    return 'no articles found.';
  }

  const results = [];
  for (const article of articles) {
    const articleData = await extractArticleContent(article.url);
    // Clean up extra whitespace and newlines in the text content
    const cleanedContent = articleData.textContent.replace(/[\s\n]+/g, ' ').trim();
    results.push({
      interest: topic, // Add the interest/topic to the result
      title: article.title,
      source: article.source.name,
      url: article.url,
      content: cleanedContent,
      imageUrl: articleData.imageUrl || article.image, // Use article image as fallback
      publishedAt: article.publishedAt || new Date() // Use current date as fallback
    });
  }
  return results;
}

module.exports = GetArticles;