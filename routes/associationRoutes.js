const express = require('express');
const router = express.Router();
const associationController = require('../controllers/associationController');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

var uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 }
});


router.post('/register', uploader.single("file"), associationController.register);
router.post('/login', associationController.login);
router.get('/getAllAssociations', associationController.getAllAssociations);

module.exports = router;
