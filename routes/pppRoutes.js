const express = require('express');
const router = express.Router();
const pppController = require('../controllers/pppcontroller');

router.post('/register', pppController.register);
router.post('/login', pppController.login);
router.get('/name/ppp-names', pppController.getPPPNams);

router.post('/:id/addPolicy', pppController.addPolicy);
router.post('/:id/addInvestmentOpportunity', pppController.addInvestmentOpportunity);
router.post('/:id/addImage', pppController.addimage);
router.post('/:id/addVideo', pppController.addvideo);
router.get('/:id/getImage', pppController.getimage);
router.get('/:id/getVideo', pppController.getvideo);
router.post('/:id/addPdf', pppController.addpdf);
router.get('/:id/getPdf', pppController.getpdf);
router.get('/', pppController.getAllPPP);
router.get('/:id', pppController.getPPPById);
router.put('/:id',pppController.editPPP);
router.delete('/:id', pppController.deletePPPById);


// Policy routes
router.get('/:id/policies', pppController.getPolicies);
router.get('/:id/policies/:policyId', pppController.getPolicyById);
router.put('/:id/policies/:policyId', pppController.updatePolicy);
router.delete('/:id/policies/:policyId', pppController.deletePolicy);

// Investment Opportunity routes
router.get('/:id/investment-opportunities', pppController.getInvestmentOpportunities);
router.get('/:id/investment-opportunities/:opportunityId', pppController.getInvestmentOpportunityById);
router.put('/:id/investment-opportunities/:opportunityId', pppController.updateInvestmentOpportunity);
router.delete('/:id/investment-opportunities/:opportunityId', pppController.deleteInvestmentOpportunity);





module.exports = router;
