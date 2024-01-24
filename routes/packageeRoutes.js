const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addPackage', authassoMiddleware,  packageController.addPackage);
router.get('/Getpackages/:associationId', authassoMiddleware,  packageController.getPackages);

module.exports = router;
