const express = require('express');
const router = express.Router();
const laxuryHotelController = require('../controllers/laxuryHotelController')
const authassoMiddleware = require('../middleware/authAssoMiddleware');

router.post('/addLaxuryHotel' ,authassoMiddleware, laxuryHotelController.addLaxuryHotel);
router.get('/getLaxuryHotel' , laxuryHotelController.getLaxuryHotel);
router.get('/AllLaxuryHotel', authassoMiddleware, laxuryHotelController.getAllLaxuryHotel);
router.get('/getById/:laxuryHotelId',laxuryHotelController.getLaxuryHotelById);
router.put('/editLaxuryHotel/:laxuryHotelId',laxuryHotelController.updateLaxuryHotel);
router.delete('/deleteLaxuryHotel/:laxuryHotelId',laxuryHotelController.deleteLaxuryHotel);


module.exports = router;
