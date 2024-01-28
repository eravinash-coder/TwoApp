const express = require('express');
const router = express.Router();
const luxuryCruiseController = require('../controllers/luxuryCruiseController')

router.post('/addLuxuryCruise' ,luxuryCruiseController.AddLuxuryCruise);


module.exports = router;