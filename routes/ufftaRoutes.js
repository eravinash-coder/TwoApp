const express = require('express');
const router = express.Router();
const ufftaController = require('../controllers/ufftaController');

// Routes for UFFTA model
router.post('/createUFFTA', ufftaController.createUFFTA);
router.get('/getAllUFFTA', ufftaController.getAllUFFTA);
router.get('/getUFFTAById/:id', ufftaController.getUFFTAById);
router.put('/updateUFFTAById/:id', ufftaController.updateUFFTAById);
router.delete('/deleteUFFTAById/:id', ufftaController.deleteUFFTAById);

module.exports = router;
