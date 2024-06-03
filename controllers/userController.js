const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken.js')
const User = require('../models/userModel.js')
const Association = require('../models/Association.js')
const luxury = require('../models/Luxury.js')
const PPP = require('../models/ppp.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
var mailer = require('../utils/mailer');
const { generateOtp, verifyOtp } = require('../utils/otp.js');


const multer = require('multer');

const handleUpload = require('../helpers/upload')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.fields([
  { name: 'image', maxCount: 10 },
]);


function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {

  try {
    const { email, password  } = req.body

    const user = await User.findOne({ email })
    const association = await Association.findOne({email});
    const Luxury = await luxury.findOne({email});
    const ppp = await PPP.findOne({email});

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.image[0],
        token: generateToken(user._id),
        redirectUrl: user.role
      }) 
    }else if (association && (await bcrypt.compare(password, association.password))){
      const token = jwt.sign({ associationId: association._id }, 'userNewsApp');
      res.json({
        name: association.name,
        email: association.email,
        avatar: association.image[0],
        token,
        redirectUrl: "/association"
      })
    }else if (Luxury && (await Luxury.matchPassword(password))){
      const token = jwt.sign({ luxuryId: Luxury._id }, 'userNewsApp');
      res.json({
        name: Luxury.name,
        email: Luxury.email,
        avatar: Luxury.avatar[0],
        token,
        redirectUrl: Luxury.type
      })
    }else if (ppp && (await ppp.comparePassword(password))){
      const token = jwt.sign({ pppId: ppp._id }, 'userNewsApp');
      res.json({
        id:ppp._id,
        name: ppp.name,
        email: ppp.email,
        avatar: ppp.image[0],
        token,
        redirectUrl: "/ppp"
      })
    }else {
      res.status(401).json({
        success: false,
        msg: 'Unauthorized user'
      })
    }

  } catch (error) {
    res.status(401).send(error.message);
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const { name, role, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        msg: 'Entered email id already registered with us. Login to continue'
      })
    }
    let imageObjects;
    if (req.files && req.files['image']) {
      imageObjects = await Promise.all(
        req.files['image'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    var user = new User({
      name,
      role,
      email,
      password, 
      image: imageObjects
    });
  
    var record = await user.save();
  
    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "PPP Added Successfully!",
      data: record,
    });
  
  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
    console.log(error.message);
  }
})



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      favorites: user.favorites,
      otp: user.otp
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: { $ne: 'admin' } })
  res.json({
    success: true,
    data: users,
  });
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    res.json({
      success: true,
      data: user,
    });
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


const resetPassword = asyncHandler(async (req, res) => {

  // console.log(verifyOtp(req.body.token));
  console.log(req.body.token)
  res.json({
    token: verifyOtp(req.body.token)
  })
  // const user = await User.findById(req.user._id)
  // const {oldPassword = ''} = req.body;
  // // For old password
  // if (user && (await user.matchPassword(oldPassword))) {
  //   let randomOtp = Math.floor(100000 + Math.random() * 900000);
  //   user.otp = randomOtp;
  //   await user.save();

  //   mailer.send({
  //     to: user.email,
  //     subject: 'Reset your password. ReactNews',
  //     html: `Your otp for reset password is ${randomOtp}`
  //   });

  //   res.status(200).json({
  //     success: true,
  //     msg: 'A Otp has been sent to your registered email address.'
  //   })
  // } else {
  //   res.status(404).json({
  //     success: false,
  //     msg: 'Entered Old Password is Incorrect.'
  //   })
  // }
});



module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  resetPassword
}