const express = require('express');
const router = express.Router();
const fcmTokenController = require('../controllers/fcmTokenController');


router.put('/AddorRemoveHotNews',  fcmTokenController.AddOrRemoveHotnews);


module.exports = router;
