const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addHotel', authassoMiddleware,  hotelController.addHotel);

module.exports = router;
