const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  url: String,
  image_url: String,
  published_at: Date,
  source: String,
});

module.exports = mongoose.model('Article', articleSchema);
