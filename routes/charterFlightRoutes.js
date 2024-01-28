const express = require('express');
const router = express.Router();
const charterFlightController = require('../controllers/charterFlightController')

router.post('/addCharterFlight' ,charterFlightController.AddLuxuryCruise);


module.exports = router;