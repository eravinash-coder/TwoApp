const ChatModel = require('../models/chatModel.js');
const MemberModel = require('../models/Member.js');

exports.createChat = async (req, res) => {
  try {
    // Check if there is an existing chat with the same sender and receiver IDs
    const existingChat = await ChatModel.findOne({
      members: {
        $all: [req.body.senderId, req.body.receiverId]
      }
    });

    if (existingChat) {
      // If a chat already exists, return a response indicating so
      return res.status(200).json({ message: 'Chat already exists' });
    }

    // If no existing chat found, proceed to create a new chat
    const Member = await MemberModel.findById(req.body.receiverId);
    const newChat = new ChatModel({
      members: [req.body.senderId, req.body.receiverId],
      name: Member.name,
    });

    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};


exports.deleteChat = async (req, res) => {
  try {
    // Find the chat based on chat ID
    const chat = await ChatModel.findById(req.params.chatId);

    if (!chat) {
      // If no chat found, return a response indicating so
      return res.status(404).json({ message: 'Chat not found' });
    }

    // If chat found, delete it
    await chat.remove();

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
