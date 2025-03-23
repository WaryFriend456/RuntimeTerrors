const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  interest: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true // Ensures no duplicate articles
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster queries by interest
articleSchema.index({ interest: 1, publishedAt: -1 });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
