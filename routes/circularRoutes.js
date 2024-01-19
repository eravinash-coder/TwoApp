const express = require('express');
const router = express.Router();
const circularController = require('../controllers/circularController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');

router.post('/', authassoMiddleware, circularController.postCircular);
router.get('/:associationId', authassoMiddleware, circularController.getCirculars);

module.exports = router;
