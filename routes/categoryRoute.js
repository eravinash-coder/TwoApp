const express = require('express');
const { addCategory, deleteCategory, getAllCategories,getCategories, editCategory, imageUpload } = require('../controllers/categoryController');
const protect = require('../middleware/authMiddleware');
const router = express.Router()

router.route('/addCategory').post(addCategory);
router.route('/deleteCategory/:catId').delete( deleteCategory);
router.route('/getAllCat').get(getAllCategories);
router.route('/getCat/:catId').get(getCategories);
router.route('/editCategory/:catId').put(editCategory);
router.route('/post/image/fb').post(imageUpload)




module.exports = router
