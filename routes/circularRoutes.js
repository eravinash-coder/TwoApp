const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const circularController = require('../controllers/circularController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, 'public')));

const multer = require('multer');

var uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 }
});

router.post('/addCircular', authassoMiddleware, uploader.single("file"), circularController.addCircular);
router.get('/getCircular', authassoMiddleware, circularController.getAllCircular);
router.get('/:associationId', authassoMiddleware, circularController.getCirculars);
router.get('/getById/:circularId',circularController.getCircularById);
router.put('/editCircular/:circularId',circularController.editCircular);
router.delete('/deleteCircular/:circularId',circularController.deleteCircular)


module.exports = router;
