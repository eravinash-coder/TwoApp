const express = require('express');
const router = express.Router();
const circularController = require('../controllers/circularController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');



router.post('/addCircular', authassoMiddleware, circularController.addCircular);
router.get('/getCircular', authassoMiddleware, circularController.getAllCircular);
router.get('/:associationId', authassoMiddleware, circularController.getCirculars);
router.get('/getById/:circularId',circularController.getCircularById);
router.put('/editCircular/:circularId',circularController.editCircular);
router.delete('/deleteCircular/:circularId',circularController.deleteCircular)


module.exports = router;
