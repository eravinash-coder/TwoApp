const Visa = require('../models/visa');
const asyncHandler = require("express-async-handler");
const multer = require('multer');

const handleUpload = require('../helpers/upload')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.array("files", 10);


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

exports.addVisa = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);

    const { 
      fname,

      lname,

      email,

      phone,

      visaType,

      address,

      city,

      state,

      country,

      zipcode } = req.body;

    const imageObjects = await Promise.all(req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
      return handleUpload(dataURI);
    }));

    const visa = new Visa({
      fname,

      lname,

      email,

      phone,

      visaType,

      address,

      city,

      state,

      country,

      zipcode,
      images: imageObjects,
    });

    await visa.save();

    res.json({
      message: 'Upload successful',
      user: visa,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});
