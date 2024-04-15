const express = require('express');
const router = express.Router();
const LaxuryTransportController = require('../controllers/LaxuryTransportController')
const authassoMiddleware = require('../middleware/authAssoMiddleware');

router.post('/addLaxuryTransport' ,authassoMiddleware, LaxuryTransportController.addLaxuryTransport);
router.get('/getLaxuryTransport' , LaxuryTransportController.getLaxuryTransport);
router.get('/AllLaxuryTransport', authassoMiddleware, LaxuryTransportController.getAllLaxuryTransport);
router.get('/getById/:laxuryTransportId',LaxuryTransportController.getLaxuryTransportById);
router.put('/editLaxuryTransport/:laxuryTransportId',LaxuryTransportController.updateLaxuryTransport);
router.delete('/deleteLaxuryTransport/:laxuryTransportId',LaxuryTransportController.deleteLaxuryTransport);


module.exports = router;
