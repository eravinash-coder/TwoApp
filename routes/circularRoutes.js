const express = require('express');
const router = express.Router();
const circularController = require('../controllers/circularController');
const authMiddleware = require('../middleware/authAssoMiddleware');

router.post('/', authMiddleware, circularController.postCircular);
router.get('/:associationId', authMiddleware, circularController.getCirculars);

module.exports = router;
