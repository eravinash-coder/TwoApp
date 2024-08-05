// nomination.routes.js
const express = require('express');
const router = express.Router();
const nominationController = require('../controllers/nominationcontroller');

// Private nomination route
router.post('/private', nominationController.submitPrivateNomination);

// Government nomination route
router.post('/government', nominationController.submitGovernmentNomination);
router.post('/submitVote', nominationController.submitVote);


router.post('/nomination', nominationController.create);

// Read all nomination
router.get('/nomination', nominationController.findAll);

// Read a single nomination by ID
router.get('/nomination/:id', nominationController.findById);

// Update a nomination by ID
router.put('/nomination/:id', nominationController.update);

// Delete a nomination by ID
router.delete('/nomination/:id', nominationController.delete);
router.get('/nomination/category/:category', nominationController.findByCategory);


module.exports = router;
