const express = require('express');
const router = express.Router();

const chaptersController = require('../controllers/chaptersController');


router.post('/addChapters', chaptersController.addChapters);
router.get('/getChapters', chaptersController.getChapters);

module.exports = router;
