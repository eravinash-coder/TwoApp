const express = require('express');
const router = express.Router();
const laxuryTransportController = require('../controllers/LaxuryTransportController')

router.post('/addLaxuryTransport' ,laxuryTransportController.AddLaxuryTransport);


module.exports = router;