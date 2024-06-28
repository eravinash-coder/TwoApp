const express = require('express');
const router = express.Router();
const StackHoderController = require('../controllers/StackHoderController');

router.post('/addStackHolder', StackHoderController.addStackHolder);
router.get('/getStackHolderByPPPId', StackHoderController.getStackHolderByPPPId);



module.exports = router;
