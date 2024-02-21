const asyncHandler = require('express-async-handler')
const Luxury = require('../models/Luxury')


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


exports.register = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const { name, type,email, password } = req.body;
    console.log(req.body);
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
    var luxury = new Luxury({
      name,
      email,
      type,
      password,
      avatar: imageObjects
    });
  
    var record = await luxury.save();
  
    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "Uploaded Successfully!",
      data: record,
    });
  
  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }
  
});




exports.getLuxuryById = asyncHandler(async (req, res) => {
  const luxury = await Luxury.findById(req.params.luxuryId)
    

  

  res.json({
    success: true,
    data: luxury,
  });
 
});


exports.getLuxury = asyncHandler(async (req, res) => {
  try{
  const type = req.headers.authorization.split(' ')[1];
  console.log(type);
  let luxury = await Luxury.find({ type });


  
  res.json({
    success: true,
    data: luxury,
  });
}catch(error) {
  res.status(400).json({ success: false, msg: error.message });
  }
});

exports.editLuxury = asyncHandler(async (req, res) => {
  try {
    
    await runMiddleware(req, res, myUploadMiddleware);
    const { name, type, email , password} = req.body;
    let luxury = await Luxury.findById(req.params.luxuryId);
    

    
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
    
    luxury.name = name;
    luxury.type = type;
    luxury.email=email;
    luxury.image=imageObjects;
    luxury.password=password;


   await luxury.save();

    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "Successfully Updated Association",
      
    });

  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }
});


exports.deleteLuxury = asyncHandler(async (req, res) => {
  
  const luxury = await Luxury.findByIdAndDelete(req.params.luxuryId);

  if (!luxury) {
    return res.status(401).json({
      success: false,
      msg: 'luxury not found.'
    });
  }

  res.status(201).json({
    success: true,
    msg: 'Successfully Deleted',
    data: luxury
  });
});