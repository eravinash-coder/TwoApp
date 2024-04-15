const express = require('express');
const router = express.Router();
const luxuryCarBookingController = require('../controllers/LuxuryCarBookingController');

// Routes
router.get('/getBooking', luxuryCarBookingController.getAllBookings);
router.post('/createBooking', luxuryCarBookingController.createBooking);

module.exports = router;
