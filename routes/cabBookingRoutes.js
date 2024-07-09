const express = require('express');
const router = express.Router();
const cabController = require('../controllers/cabBookingController');

router.get('/cab', cabController.getAllCabs);
router.get('/cab/:id', cabController.getCabById);
router.post('/cab', cabController.createCab);
router.patch('/cab/:id', cabController.updateCab);
router.delete('/cab/:id', cabController.deleteCab);

module.exports = router;
