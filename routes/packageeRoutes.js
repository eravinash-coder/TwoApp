const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addPackage', authassoMiddleware,  packageController.addPackage);
router.get('/Getpackages/:associationId', authassoMiddleware,  packageController.getPackages);
router.get('/mypackages', authassoMiddleware, packageController.getMyPackages);
router.put('/updatePackage/:PackageId', authassoMiddleware, packageController.updatePackage);
router.delete('/deletePackage/:PackageId', authassoMiddleware, packageController.deletePackage);

module.exports = router;
