const LaxuryTransport = require('../models/LaxuryTransport');
const asyncHandler = require("express-async-handler");
const multer = require('multer');

const handleUpload = require('../helpers/upload')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.fields([
  { name: 'image', maxCount: 10 },
  { name: 'home_image', maxCount: 10 }
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

exports.addLaxuryTransport = asyncHandler(async (req, res) => {
  try {
    const laxuryId = req.user.laxuryId;
    await runMiddleware(req, res, myUploadMiddleware);

    const { 
        name,
        title,
        information,
        video,
        amenities,
        website } = req.body;
      let imageObjects,home_imageObjects;

    if (req.files && req.files['image']) {
      imageObjects = await Promise.all(
        req.files['image'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['home_image']) {
        home_imageObjects = await Promise.all(
        req.files['home_image'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }

    const laxuryTransport = new LaxuryTransport({
       laxuryId,
        name,
        title,
        information,
        amenities,
        video,
        website,
        image_url:imageObjects,
        home_url: home_imageObjects


    });

    await laxuryTransport.save();

    res.json({
      message: 'Upload successful',
      data: laxuryTransport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

exports.getLaxuryTransport = async (req, res) => {
  try {
    const hotels = await LaxuryTransport.find();

    const formattedTransports = hotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      title: hotel.title,
      amenities: hotel.amenities,
      image_url: hotel.image_url,
      website: hotel.website,
      information: hotel.information,
      video: hotel.video,
    }));

    const homeimgurl = hotels.map(hotel => ({
      image_url: hotel.home_url,
    }));

    const response = {
      Transports: formattedTransports,
      homeimgurl: homeimgurl,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllLaxuryTransport = asyncHandler(async (req, res) => {
  
  const laxuryId = req.user.laxuryId;

  let laxuryTransport = await LaxuryTransport.find({laxuryId});

 res.json({
   success: true,
   data: laxuryTransport,
 });
});

exports.updateLaxuryTransport = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    await runMiddleware(req, res, myUploadMiddleware);

    const { 
        name,
        title,
        amenities,
        website,
        information,
        video } = req.body;
    let imageObjects, home_imageObjects;

    if (req.files && req.files['image']) {
      imageObjects = await Promise.all(
        req.files['image'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['home_image']) {
      home_imageObjects = await Promise.all(
        req.files['home_image'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }

    const laxuryTransportId = req.params.laxuryTransportId; // Assuming you're passing hotel ID in the URL
    const laxuryTransport = await LaxuryTransport.findById(laxuryTransportId);

    if (!laxuryTransport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    // Update hotel properties
    laxuryTransport.name = name;
    laxuryTransport.title = title;
    laxuryTransport.amenities = amenities;
    laxuryTransport.website = website;
    laxuryTransport.information = information;
    laxuryTransport.video = video;
    laxuryTransport.image_url = imageObjects;
    laxuryTransport.home_url = home_imageObjects;

    await laxuryTransport.save();

    res.json({
      message: 'Transport updated successfully',
      data: laxuryTransport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});


exports.deleteLaxuryTransport = asyncHandler(async (req, res) => {
  
  const laxuryTransport = await LaxuryTransport.findByIdAndDelete(req.params.laxuryTransportId);

  if (!laxuryTransport) {
    return res.status(401).json({
      success: false,
      msg: 'Member not found.'
    });
  }

  res.status(201).json({
    success: true,
    msg: 'Successfully Deleted',
    data: laxuryTransport
  });
});
 
exports.getLaxuryTransportById = asyncHandler(async (req, res) => {
  const laxuryTransport = await LaxuryTransport.findById(req.params.laxuryTransportId)
  

  res.json({
    success: true,
    data: laxuryTransport,
  });
 
});