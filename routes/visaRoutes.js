const express = require('express');
const handler = require('../helpers/upload');
const router = express.Router();
const visaController = require('../controllers/visaController')

router.post('/addvisa' , visaController.addVisa);


module.exports = router;
