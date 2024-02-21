const express = require('express');
const router = express.Router();

const luxuryController = require('../controllers/luxuryController');


router.post('/register', luxuryController.register);
router.get('/getLuxury', luxuryController.getLuxury);
router.get('/getById/:luxuryId',luxuryController.getLuxuryById);
router.put('/editLuxury/:luxuryId',luxuryController.editLuxury);
router.delete('/deleteLuxury/:luxuryId',luxuryController.deleteLuxury)


module.exports = router;