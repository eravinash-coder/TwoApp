const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    name:String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chat', ChatSchema);
