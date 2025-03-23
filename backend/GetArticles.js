const axios = require('axios');
// Modified require to include VirtualConsole
const { JSDOM, VirtualConsole } = require('jsdom');
const { Readability } = require('@mozilla/readability');
// const readlineSync = require('readline-sync');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const API_KEY = process.env.NEWS_API_KEY; // Your GNews API key

// Function to fetch articles from GNews API with retry mechanism
async function fetchArticles(params, retries = 3, timeout = 10000) {
  try {
    const response = await axios.get('https://gnews.io/api/v4/search', { 
      params,
      timeout: timeout // Set a timeout to prevent hanging
    });
    return response.data.articles || [];
  } catch (error) {
    // Check if we should retry
    if (retries > 0) {
      console.log(`Retrying API call. Attempts remaining: ${retries-1}`);
      // Wait for a short time before retrying (exponential backoff)
      // const delay = 2000 * (3 - retries + 1);
      // await new Promise(resolve => setTimeout(resolve, delay));
      // return fetchArticles(params, retries - 1, timeout);
    }
    
    // Categorize the error for better debugging
    if (error.code === 'ECONNABORTED') {
      console.error('Error fetching articles: Request timeout');
    } else if (error.code === 'ECONNRESET' || error.message.includes('socket hang up')) {
      console.error('Error fetching articles: Connection reset (socket hang up)');
    } else {
      console.error('Error fetching articles:', error.response ? error.response.data : error.message);
    }
    return [];
  }
}

// Modified extractArticleContent function to suppress CSS errors via VirtualConsole
async function extractArticleContent(url, timeout = 10000) {
  try {
    const response = await axios.get(url, { timeout: timeout });
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
      // Get publishedAt content from meta tag instead of the element itself
      const publishedAtElement = dom.window.document.querySelector('meta[property="article:published_time"]');
      const publishedAt = publishedAtElement ? publishedAtElement.getAttribute("content") : null;
      return { textContent: article.textContent, imageUrl, publishedAt };
    }
    return { textContent: 'Content could not be extracted.', imageUrl: null, publishedAt: null };
  } catch (error) {
    console.error(`Error fetching full article content for ${url}:`, error.message);
    return { textContent: 'Content could not be extracted.', imageUrl: null, publishedAt: null };
  }
}

// Main function to run the script
async function GetArticles(topic) {
  const maxArticles = 10; // Default to 10 articles
  
  // Try different API parameters if initial query fails
  const attemptFetch = async (countryCode = 'in', pageNum = null) => {
    const params = {
      token: API_KEY,
      lang: 'en',
      max: maxArticles,
      sortby: 'publishedAt',
      q: topic,
      country: countryCode
    };
    
    // Only add page parameter if specified
    if (pageNum !== null) {
      params.page = pageNum;
    }
    
    return await fetchArticles(params);
  };
  
  // First try with random page
  let articles = await attemptFetch('in', Math.floor(Math.random() * 5) + 1);
  
  // // If no articles found, try without page parameter
  // if (articles.length === 0) {
  //   console.log('No articles found with random page. Trying without page parameter...');
  //   articles = await attemptFetch('in', null);
  // }
  
  // // If still no articles, try without country restriction
  // if (articles.length === 0) {
  //   console.log('No articles found for India. Trying without country restriction...');
  //   articles = await attemptFetch(null, null);
  // }

  if (articles.length === 0) {
    console.log('No articles found after multiple attempts.');
    return [{
      interest: topic,
      title: `No articles found for "${topic}"`,
      source: "System Notice",
      url: "",
      content: `We couldn't find any articles about "${topic}" at this time. Please try a different topic or try again later.`,
      imageUrl: null,
      publishedAt: new Date().toISOString()
    }];
  }

  const results = [];
  for (const article of articles) {
    try {
      const articleData = await extractArticleContent(article.url);
      // Clean up extra whitespace and newlines in the text content
      const cleanedContent = articleData.textContent.replace(/[\s\n]+/g, ' ').trim();
      results.push({
        interest: topic, // Add the interest/topic to the result
        title: article.title,
        source: article.source.name,
        url: article.url,
        publishedAt: articleData.publishedAt || article.publishedAt || new Date().toISOString(),
        content: cleanedContent,
        imageUrl: articleData.imageUrl || article.image // Use article image as fallback
      }); 
    } catch (error) {
      console.error(`Error processing article ${article.title}:`, error.message);
      // Skip this article and continue with the next one
    }
  }
  
  return results.length > 0 ? results : [{
    interest: topic,
    title: `Technical difficulties retrieving articles for "${topic}"`,
    source: "System Notice",
    url: "",
    content: `We encountered some technical difficulties while retrieving articles about "${topic}". Please try again later.`,
    imageUrl: null,
    publishedAt: new Date().toISOString()
  }];
}

module.exports = GetArticles;