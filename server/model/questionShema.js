const mongoose = require('mongoose');

const topPlayerSchema = new mongoose.Schema({
  playerName: {
    type: String
  },
  time: {
    type: Number
  }
});

const quizQuestionsSchema = new mongoose.Schema({
  fullName: {
    type: String
  },
  question: {
    type: String
  },
  options: {
    type: Array
  },
  correctAnswer: {
    type: String
  },
  video: {
    type: String
  },
  topPlayers: [topPlayerSchema]
});

module.exports = mongoose.model('quizQuestions', quizQuestionsSchema);
