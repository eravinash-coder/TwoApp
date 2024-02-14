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
router.get('/getUpdate', authassoMiddleware, updateController.getAllUpdate);
router.get('/:associationId', authassoMiddleware, updateController.getUpdate);
router.get('/getById/:updateId',updateController.getUpdateById);
router.put('/editUpdate/:updateId',updateController.editUpdate);
router.delete('/deleteUpdate/:updateId',updateController.deleteUpdate)


module.exports = router;
