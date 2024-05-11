const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    senderName:String,
    receiverName:String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chat', ChatSchema);
