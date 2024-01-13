const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.post('/register', memberController.register);
router.post('/login', memberController.login);

module.exports = router;
