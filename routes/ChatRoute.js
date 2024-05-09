const express = require('express');
const ChatController = require('../controllers/ChatController');
const router = express.Router()

router.post('/', ChatController.createChat);
router.get('/:userId', ChatController.userChats);
router.get('/find/:firstId/:secondId', ChatController.findChat);
router.delete('/delete/:chatId', ChatController.deleteChat);

module.exports = router;