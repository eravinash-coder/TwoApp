const LaxuryHotel = require('../models/laxuryHotel');
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

exports.addLaxuryHotel = asyncHandler(async (req, res) => {
  try {
    const laxuryId = req.user.laxuryId;
    await runMiddleware(req, res, myUploadMiddleware);

    const { 
        name,
        title,
        address,
        city,
        country,
        access,
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

    const laxuryHotel = new LaxuryHotel({
       laxuryId,
        name,
        title,
        address,
        city,
        country,
        access,
        information,
        amenities,
        video,
        website,
        image_url:imageObjects,
        home_url: home_imageObjects


    });

    await laxuryHotel.save();

    res.json({
      message: 'Upload successful',
      data: laxuryHotel,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

exports.getLaxuryHotel = async (req, res) => {
  try {
    const hotels = await LaxuryHotel.find();

    const formattedHotels = hotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      title: hotel.title,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      Access: hotel.access,
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
      hotels: formattedHotels,
      homeimgurl: homeimgurl,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllLaxuryHotel = asyncHandler(async (req, res) => {
  
  const laxuryId = req.user.laxuryId;

  let laxuryHotel = await LaxuryHotel.find({laxuryId});

 res.json({
   success: true,
   data: laxuryHotel,
 });
});

exports.updateLaxuryHotel = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    await runMiddleware(req, res, myUploadMiddleware);

    const { 
        name,
        title,
        address,
        city,
        country,
        access,
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

    const laxuryHotelId = req.params.laxuryHotelId; // Assuming you're passing hotel ID in the URL
    const laxuryHotel = await LaxuryHotel.findById(laxuryHotelId);

    if (!laxuryHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Update hotel properties
    laxuryHotel.name = name;
    laxuryHotel.title = title;
    laxuryHotel.address = address;
    laxuryHotel.city = city;
    laxuryHotel.country = country;
    laxuryHotel.access = access;
    laxuryHotel.amenities = amenities;
    laxuryHotel.website = website;
    laxuryHotel.information = information;
    laxuryHotel.video = video;
    laxuryHotel.image_url = imageObjects;
    laxuryHotel.home_url = home_imageObjects;

    await laxuryHotel.save();

    res.json({
      message: 'Hotel updated successfully',
      data: laxuryHotel,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});


exports.deleteLaxuryHotel = asyncHandler(async (req, res) => {
  
  const laxuryHotel = await LaxuryHotel.findByIdAndDelete(req.params.laxuryHotelId);

  if (!laxuryHotel) {
    return res.status(401).json({
      success: false,
      msg: 'Member not found.'
    });
  }

  res.status(201).json({
    success: true,
    msg: 'Successfully Deleted',
    data: laxuryHotel
  });
});
 
exports.getLaxuryHotelById = asyncHandler(async (req, res) => {
  const laxuryHotel = await LaxuryHotel.findById(req.params.laxuryHotelId)
  

  res.json({
    success: true,
    data: laxuryHotel,
  });
 
});