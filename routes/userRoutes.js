const express = require('express');
const router = express.Router()
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  resetPassword,
} = require('../controllers/userController');

const protect = require('../middleware/authMiddleware.js')

router.route('/').post(registerUser).get(getUsers)
router.route('/login').post(authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/:id')
   .delete(deleteUser)
  .get(getUserById)
  .put(updateUser)

router.route('/profile/password/reset').post(protect ,resetPassword);

module.exports = router