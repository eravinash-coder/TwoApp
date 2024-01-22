const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const updateController = require('../controllers/updateController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, 'public')));

const multer = require('multer');

var uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 }
});

router.post('/addUpdate', authassoMiddleware, uploader.single("file"), updateController.addUpdate);
router.get('/:associationId', authassoMiddleware, updateController.getUpdate);

module.exports = router;
