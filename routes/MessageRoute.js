const express = require('express');

const MessageController = require('../controllers/MessageController');

const router = express.Router();

router.post('/', MessageController.addMessage);

router.get('/:chatId', MessageController.getMessages);

module.exports = router;