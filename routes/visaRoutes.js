const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const visaController = require('../controllers/visaController');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, 'public')));

const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb){
    cb(null, file.originalname)
  }
});
const uploader = multer({storage:storage});

router.post('/addvisa', uploader.single("file"), visaController.addVisa);


module.exports = router;
