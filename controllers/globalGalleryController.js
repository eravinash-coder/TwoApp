const GlobalGallery = require('../models/globalGallery');


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
exports.createGlobalGallery = asyncHandler( async (req, res) => {
    try {
        await runMiddleware(req, res, myUploadMiddleware);
       const { category} = req.body;

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

        var ad = new GlobalGallery({
            category,
            urlToImage: imageObjects,

        });

        var record = await ad.save();

        // Send success response inside the try block
        res.status(201).json({
            success: true,
            msg: "Successfully GlobalGalleryded",
            data: record,
        });

    } catch (error) {
        // Send error response inside the catch block
        res.status(400).json({ success: false, msg: error.message });
        console.log(error.message);
    }
});

// Read all ads
exports.getAllGlobalGallerys = async (req, res) => {
  try {
    const ads = await GlobalGallery.find();
    res.status(200).json({success: true, data: ads});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getGalleryByCategory = async (req, res) => {
    try {
        const category = req.query.category || 'general'; // Default to 'general' if no category is specified
        const items = await GlobalGallery.find({ category }).exec();

        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getGlobalGalleryById = async (req, res) => {
    try {
      const ad = await GlobalGallery.findById(req.params.id);
      if (!ad) {
        return res.status(404).json({ message: 'GlobalGallery not found' });
      }
      res.status(200).json({success: true, data: ad});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
// Update an existing ad
exports.updateGlobalGallery = async (req, res) => {
    try {
        let chapters = await GlobalGallery.findById(req.params.id);

        if (!chapters) {
            return res.status(401).json({
                success: false,
                msg: 'GlobalGallerys not found.'
            })
        }
        await runMiddleware(req, res, myUploadMiddleware);
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

        chapters = await GlobalGallery.findByIdAndUpdate(req.params.id, {urlToImage: imageObjects }, {
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
exports.deleteGlobalGallery = async (req, res) => {
  try {
    await GlobalGallery.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
