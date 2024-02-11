const express = require('express');
const router = express.Router();

const boardController = require('../controllers/boardController');


router.post('/addBoards', boardController.addBoards);
router.get('/getBoards/:associationId', boardController.getBoards);

module.exports = router;
