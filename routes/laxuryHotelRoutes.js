const express = require('express');
const handler = require('../helpers/upload');
const router = express.Router();
const laxuryHotelController = require('../controllers/laxuryHotelController')

router.post('/addLaxuryHotel' , laxuryHotelController.addLaxuryHotel);
router.get('/getLaxuryHotel' , laxuryHotelController.getLaxuryHotel);


module.exports = router;
