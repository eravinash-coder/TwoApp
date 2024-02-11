const express = require('express');
const router = express.Router();

const aboutController = require('../controllers/aboutController');


router.post('/addAbout', aboutController.addAbout);
router.get('/getAbout/:associationId', aboutController.getAbout);

module.exports = router;
