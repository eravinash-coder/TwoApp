//insurenceRoutes.js
const express = require('express');
const router = express.Router();
const insurenceController = require('../controllers/insurenceController');

router.route('/insurances')
    .get(insurenceController.getAllInsurances)
    .post(insurenceController.createInsurance);

router.route('/insurances/:id')
    .get(insurenceController.getInsurance)
    .patch(insurenceController.updateInsurance)
    .delete(insurenceController.deleteInsurance);

module.exports = router;
