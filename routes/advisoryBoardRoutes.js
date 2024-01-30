const express = require('express');
const router = express.Router();

const advisoryBoardController = require('../controllers/advisoryBoardController');


router.post('/addAdvisoryBoard', advisoryBoardController.addAdvisoryBoard);
router.get('/getAdvisoryBoard', advisoryBoardController.getAdvisoryBoard);

module.exports = router;
