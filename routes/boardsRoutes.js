const express = require('express');
const router = express.Router();

const boardController = require('../controllers/boardController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');


router.post('/addBoards', authassoMiddleware, boardController.addBoards);
router.get('/getBoards/:associationId', boardController.getBoards);
router.get('/getAllBoards',authassoMiddleware, boardController.getAllBoards);
router.get('/getById/:boardsId',boardController.getBoardsById);
router.put('/editBoards/:boardsId',boardController.editBoards);
router.delete('/deleteBoards/:boardsId',boardController.deleteBoards)

module.exports = router;
  