const ChatModel = require('../models/chatModel.js');
const MemberModel = require('../models/Member.js');

exports.createChat = async (req, res) => {
  const Member = await MemberModel.findById(req.body.receiverId);
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
    name:Member.name,
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
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