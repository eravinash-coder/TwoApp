const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');
const multer = require('multer'); // Import multer for file upload handling
const upload = multer({ dest: '../uploads/' });

router.post('/register', authassoMiddleware, memberController.register);
router.post('/addMemberBulk', upload.single('excelFile'), authassoMiddleware, memberController.addMemberBulk);
router.post('/login', memberController.login);
router.get('/getMember',authassoMiddleware, memberController.getMember);
router.get('/getById/:memberId',memberController.getMemberById);
router.put('/editMember/:memberId',memberController.editMember);
router.delete('/deleteMember/:memberId',memberController.deleteMember)




module.exports = router;
