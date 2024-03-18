const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');

router.post('/register', authassoMiddleware, memberController.register);
router.post('/addMemberBulk', authassoMiddleware, memberController.addMemberBulk);
router.post('/login', memberController.login);
router.get('/getMember',authassoMiddleware, memberController.getMember);
router.get('/getById/:memberId',memberController.getMemberById);
router.put('/editMember/:memberId',memberController.editMember);
router.delete('/deleteMember/:memberId',memberController.deleteMember);
router.post('/sendNotification',authassoMiddleware,memberController.sendNotification);
router.put('/forgotPassword',memberController.forgotPassword);




module.exports = router;
