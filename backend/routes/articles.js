const express = require('express');
const Article = require('../models/Article');
const User = require('../models/User');
const GetArticles = require('../GetArticles');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get articles by interest
router.get('/interest/:interest', authenticateToken, async (req, res) => {
  try {
    const articles = await Article.find({ interest: req.params.interest })
      .sort({ publishedAt: -1 })
      .limit(20);

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles by interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all articles for the user's interests
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get the user's interests
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If no interests, return empty array
    if (!user.interests || user.interests.length === 0) {
      return res.json([]);
    }

    // Fetch articles for all interests
    const articles = await Article.find({ interest: { $in: user.interests } })
      .sort({ publishedAt: -1 })
      .limit(50);

    res.json(articles);
  } catch (error) {
    console.error('Error fetching all articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh articles for a specific interest
router.post('/refresh/:interest', authenticateToken, async (req, res) => {
  try {
    const interest = req.params.interest;
    
    // Fetch fresh articles from the API
    const newArticles = await GetArticles(interest);
    
    if (!newArticles || newArticles === 'no articles found.') {
      return res.status(404).json({ message: 'No articles found for this interest' });
    }

    // Process and save each article, checking for duplicates by URL
    const savedArticles = [];
    for (const article of newArticles) {
      // Check if article already exists by URL
      const exists = await Article.findOne({ url: article.url });
      if (!exists) {
        const newArticle = new Article({
          interest,
          title: article.title,
          source: article.source,
          url: article.url,
          content: article.content,
          imageUrl: article.imageUrl,
          publishedAt: new Date()
        });
        await newArticle.save();
        savedArticles.push(newArticle);
      }
    }

    res.json({
      message: `Refreshed articles for ${interest}`,
      newArticlesCount: savedArticles.length
    });
  } catch (error) {
    console.error('Error refreshing articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh articles for all user interests
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    // Get the user's interests
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If no interests, return error
    if (!user.interests || user.interests.length === 0) {
      return res.status(400).json({ message: 'No interests found for this user' });
    }

    const results = {};
    
    // Process each interest
    for (const interest of user.interests) {
      // Fetch fresh articles from the API
      const newArticles = await GetArticles(interest);
      
      if (!newArticles || newArticles === 'no articles found.') {
        results[interest] = 'No articles found';
        continue;
      }

      // Process and save each article, checking for duplicates by URL
      let savedCount = 0;
      for (const article of newArticles) {
        // Check if article already exists by URL
        const exists = await Article.findOne({ url: article.url });
        if (!exists) {
          const newArticle = new Article({
            interest,
            title: article.title,
            source: article.source,
            url: article.url,
            content: article.content,
            imageUrl: article.imageUrl,
            publishedAt: new Date()
          });
          await newArticle.save();
          savedCount++;
        }
      }

      results[interest] = `Added ${savedCount} new articles`;
    }

    // After refresh, fetch the updated articles
    const articles = await Article.find({ interest: { $in: user.interests } })
      .sort({ publishedAt: -1 })
      .limit(50);

    res.json({
      message: 'Refreshed articles for all interests',
      results,
      articles
    });
  } catch (error) {
    console.error('Error refreshing all articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
