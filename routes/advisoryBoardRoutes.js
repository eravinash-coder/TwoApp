const express = require('express');
const router = express.Router();

const advisoryBoardController = require('../controllers/advisoryBoardController');


router.post('/addAdvisoryBoard', advisoryBoardController.addAdvisoryBoard);
router.get('/getAdvisoryBoard', advisoryBoardController.getAdvisoryBoard);
router.get('/getAllAdvisoryBoards', advisoryBoardController.getAllAdvisoryBoards);
router.get('/getById/:AdvisoryBoardId',advisoryBoardController.getAdvisoryBoardsById);
router.put('/editAdvisoryBoard/:AdvisoryBoardId',advisoryBoardController.editAdvisoryBoards);
router.delete('/deleteAdvisoryBoard/:AdvisoryBoardId',advisoryBoardController.deleteAdvisoryBoards)

module.exports = router;
