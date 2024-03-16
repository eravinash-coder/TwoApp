const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController')

router.post('/createAd', adController.createAd);
router.get('/getAllAds', adController.getAllAds);
router.put('/updateAd/:id', adController.updateAd);
router.delete('/deleteAd/:id', adController.deleteAd);
router.get('/getById/:id', adController.getAdById);

module.exports = router;
