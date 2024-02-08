const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController')

router.post('/addInterview' , interviewController.addInterview);
router.get('/getAllInterview/:page/:perPage' , interviewController.getAllInterview);
router.get('/getInterview',interviewController.getInterviews);
router.get('/getById/:InterviewId',interviewController.getInterviewById);
router.put('/editInterview/:InterviewId',interviewController.editInterview);
router.delete('/deleteInterview/:InterviewId',interviewController.deleteInterview)



module.exports = router;
