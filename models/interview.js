const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  title: String,
  videos: [Object],
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', InterviewSchema);
