const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addHotel', authassoMiddleware,  hotelController.addHotel);
router.get('/GetHotels/:associationId', authassoMiddleware,  hotelController.getHotel);

module.exports = router;
