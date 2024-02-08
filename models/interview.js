const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  title: String,
  thumbnail:[Object],
  videos: [Object],
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', InterviewSchema);
