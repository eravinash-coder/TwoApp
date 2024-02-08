const express = require('express');
const router = express.Router();
const associationController = require('../controllers/associationController');


router.post('/register', associationController.register);
router.post('/login', associationController.login);
router.get('/getAllAssociations', associationController.getAllAssociations);
router.get('/getAssociations', associationController.getAssociaton);
router.get('/getById/:associationId',associationController.getAssociationById);
router.put('/editAssociation/:associationId',associationController.editAssociation);
router.delete('/deleteAssociation/:associationId',associationController.deleteAssociation)



module.exports = router;
