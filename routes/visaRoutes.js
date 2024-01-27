const express = require('express');
const handler = require('../helpers/upload');
const router = express.Router();


router.post('/addvisa' , handler);


module.exports = router;
