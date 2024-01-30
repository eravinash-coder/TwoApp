const express = require('express');
const router = express.Router();

const skillDevelopmentController = require('../controllers/skillDevelopmentController');


router.post('/addSkillDevelopment', skillDevelopmentController.addSkillDevelopment);


module.exports = router;
