const AdvisoryBoard = require('../models/advisoryBoard');
const asyncHandler = require("express-async-handler");
const multer = require('multer');

const handleUpload = require('../helpers/upload')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.fields([
  { name: 'image', maxCount: 10 }
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

exports.addAdvisoryBoard = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);

    const {name,post,about} = req.body;
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

    const advisoryBoardSchema = new AdvisoryBoard({
    
        name,
        post,
        about,
        images: imageObjects,


    });

    await advisoryBoardSchema.save();

    res.json({
      message: 'Upload successful',
      data: advisoryBoardSchema,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

exports.getAdvisoryBoard  = async (req, res) => {
    try {
      const advisoryBoard = await AdvisoryBoard.find();
  
      
  
      
      const responseData = { advisoryBoard };
  
      res.send([responseData]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
