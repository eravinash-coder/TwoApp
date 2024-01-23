const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addPackage', authassoMiddleware,  packageController.addPackage);

module.exports = router;
