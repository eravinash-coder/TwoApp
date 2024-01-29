const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addtransport', authassoMiddleware,  transportController.addtransport);
router.get('/GetTransport/:associationId', authassoMiddleware,  transportController.getTransport);
router.get('/mytransports', authassoMiddleware, transportController.getMyTransports);
router.put('/updateTransport/:TransportId', authassoMiddleware, transportController.updateTransport);
router.delete('/deleteTransport/:TransportId', authassoMiddleware, transportController.deleteTransport);
router.put('/AddorRemovefavorites', authassoMiddleware, transportController.AddorRemovefavorites);
router.get('/getfavorites', authassoMiddleware, transportController.getfavoritesTransport);
module.exports = router;
