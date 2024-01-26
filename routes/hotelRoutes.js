const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addHotel', authassoMiddleware,  hotelController.addHotel);
router.get('/GetHotels/:associationId', authassoMiddleware,  hotelController.getHotel);
router.get('/myhotels', authassoMiddleware, hotelController.getMyHotels);
router.put('/updateHotel/:hotelId', authassoMiddleware, hotelController.updateHotel);
router.delete('/deleteHotel/:hotelId', authassoMiddleware, hotelController.deleteHotel);

module.exports = router;
