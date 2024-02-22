const express = require('express');
const router = express.Router();
const dmcContoller = require('../controllers/dmcContoller')

router.post('/addDmc' , dmcContoller.addDMC);


module.exports = router;
