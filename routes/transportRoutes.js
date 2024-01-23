const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addtransport', authassoMiddleware,  transportController.addtransport);

module.exports = router;
