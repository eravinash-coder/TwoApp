const express = require('express');
const router = express.Router();
const pppController = require('../controllers/pppcontroller');

router.post('/register', pppController.register);
router.post('/login', pppController.login);


router.post('/:id/addPolicy', pppController.addPolicy);
router.post('/:id/addInvestmentOpportunity', pppController.addInvestmentOpportunity);
router.get('/', pppController.getAllPPP);
router.get('/:id', pppController.getPPPById);
router.put('/:id',pppController.editPPP);
router.delete('/:id', pppController.deletePPPById);



module.exports = router;
