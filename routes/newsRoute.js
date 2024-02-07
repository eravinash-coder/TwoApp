const express = require('express');
const router = express.Router();
const  newsController = require('../controllers/newsController');

const protect = require('../middleware/authMiddleware.js')

router.post('/addNews',newsController.addNews);
router.get('/getAllNews/:page/:perPage',newsController.getAllNews);
router.get('/getNews',newsController.getNews);
router.get('/getAllNews/me/:page/:perPage',protect,newsController.getNewsByUser);
router.get('/getAllNews/slider',newsController.sliderNews);
router.get('/getNews/by/today',newsController.getTodayNews)
router.get('/getById/:newsId',newsController.getNewsId);
router.get('/getByCategory/:catId/:page/:perPage',newsController.getNewsByCategory);
router.get('/getrelatedNews/:catId',newsController.getRelatedNews);

router.put('/editNews/:newsId',newsController.editNews);

router.put('/add/comment/onNews',protect,newsController.addComment);


router.delete('/remove/comment/onNews',protect,newsController.removeComment);







// router.get('/login').post(authUser)
// router
//   .get('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile)
// router
//   .get('/:id')
// //   .delete(protect, deleteUser)
//   .get(protect, getUserById)
// //   .put(protect, updateUser)

module.exports = router