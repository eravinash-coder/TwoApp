const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const visaController = require('../controllers/visaController');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, 'public')));

const multer = require('multer');

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500000 }
});

router.post('/addvisa', uploader.single("file"), visaController.addVisa);


module.exports = router;
