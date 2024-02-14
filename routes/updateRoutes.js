const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');


router.post('/addUpdate', authassoMiddleware, updateController.addUpdate);
router.get('/getUpdate', authassoMiddleware, updateController.getAllUpdate);
router.get('/:associationId', authassoMiddleware, updateController.getUpdate);
router.get('/getById/:updateId',updateController.getUpdateById);
router.put('/editUpdate/:updateId',updateController.editUpdate);
router.delete('/deleteUpdate/:updateId',updateController.deleteUpdate)


module.exports = router;
