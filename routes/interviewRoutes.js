const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController')

router.post('/addInterview' , interviewController.addInterview);
router.get('/getAllInterview/:page/:perPage' , interviewController.getAllInterview);


module.exports = router;
