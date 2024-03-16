const Ad = require('../models/ad');


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

// Create a new ad
exports.createAd = asyncHandler( async (req, res) => {
    try {
        await runMiddleware(req, res, myUploadMiddleware);
        const { place, hitUrl } = req.body;


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

        var ad = new Ad({
            place,
            hitUrl,
            urlToImage: imageObjects,

        });

        var record = await ad.save();

        // Send success response inside the try block
        res.status(201).json({
            success: true,
            msg: "Successfully Added",
            data: record,
        });

    } catch (error) {
        // Send error response inside the catch block
        res.status(400).json({ success: false, msg: error.message });
    }
});

// Read all ads
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find();
    res.status(200).json({success: true, data: ads});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdById = async (req, res) => {
    try {
      const ad = await Ad.findById(req.params.id);
      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' });
      }
      res.status(200).json({success: true, data: ad});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
// Update an existing ad
exports.updateAd = async (req, res) => {
    try {
        let chapters = await Ad.findById(req.params.id);

        if (!chapters) {
            return res.status(401).json({
                success: false,
                msg: 'Ads not found.'
            })
        }
        await runMiddleware(req, res, myUploadMiddleware);
        const { place, hitUrl } = req.body;
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

        chapters = await Ad.findByIdAndUpdate(req.params.id, {place, hitUrl, urlToImage: imageObjects }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: chapters, msg: 'Successfully updated' });


    } catch (error) {
        // Send error response inside the catch block
        res.status(400).json({ success: false, msg: error.message });
    }
};

// Delete an existing ad
exports.deleteAd = async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
