const express = require('express');
const router = express.Router();

const destinationProgramController = require('../controllers/destinationProgramController');


router.post('/addDestinationProgram', destinationProgramController.addDestinationProgram);


module.exports = router;
