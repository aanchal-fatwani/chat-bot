const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  questions: [
    {
      type: String
    }
  ],
  answers: [
    {
      type: String
    }
  ],
  choices: [
    {
      type: String
    }
  ]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
