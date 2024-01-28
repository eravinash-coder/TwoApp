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
    await runMiddleware(req, res, myUploadMiddleware);

    const { 
        name,
        title,
        address,
        city,
        country,
        access,
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
        name,
        title,
        address,
        city,
        country,
        access,
        amenities,
        website,
        image_url:imageObjects,
        home_url:home_imageObjects


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
