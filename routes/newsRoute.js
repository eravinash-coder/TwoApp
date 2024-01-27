const express = require('express');
const router = express.Router()
const path = require('path');
const bodyParser = require('body-parser');
const user = express();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, 'public')));

const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb){
    cb(null, file.originalname)
  }
});
const uploader = multer({storage:storage});
const {
    addNews, getAllNews, getNewsByUser,getTodayNews, getNewsId, getNewsByCategory, editNews, sliderNews, getRelatedNews, addComment, removeComment
} = require('../controllers/newsController');

const protect = require('../middleware/authMiddleware.js')

router.route('/addNews').post(uploader.single("file"),addNews);
router.route('/getAllNews/:page/:perPage').get(getAllNews);
router.route('/getAllNews/me/:page/:perPage').get(protect, getNewsByUser);
router.route('/getAllNews/slider').get(sliderNews);
router.route('/getNews/by/today').get(getTodayNews)
router.route('/getById/:newsId').get(getNewsId);
router.route('/getByCategory/:catId/:page/:perPage').get(getNewsByCategory);
router.route('/getrelatedNews/:catId').get(getRelatedNews);

router.route('/editNews/:newsId').put(editNews);

router.route('/add/comment/onNews').put(protect, addComment);


router.route('/remove/comment/onNews').delete(protect, removeComment);







// router.route('/login').post(authUser)
// router
//   .route('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile)
// router
//   .route('/:id')
// //   .delete(protect, deleteUser)
//   .get(protect, getUserById)
// //   .put(protect, updateUser)

module.exports = router