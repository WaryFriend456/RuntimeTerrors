const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'bot'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    messages: [messageSchema]
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);