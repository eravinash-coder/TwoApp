// nomination.routes.js
const express = require('express');
const router = express.Router();
const nominationController = require('../controllers/nominationcontroller');

// Private nominations route
router.post('/private', nominationController.submitPrivateNomination);

// Government nominations route
router.post('/government', nominationController.submitGovernmentNomination);
router.post('/submitVote', nominationController.submitVote);


module.exports = router;
