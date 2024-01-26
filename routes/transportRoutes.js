const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addtransport', authassoMiddleware,  transportController.addtransport);
router.get('/GetTransport/:associationId', authassoMiddleware,  transportController.getTransport);
router.get('/mytransports', authassoMiddleware, transportController.getMyTransports);
router.delete('/deleteTransport/:TransportId', authassoMiddleware, transportController.deleteTransport);

module.exports = router;
