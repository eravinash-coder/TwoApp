// nomination.controller.js

const PrivateNomination = require('../models/privateNomination');
const GovernmentNomination = require('../models/governmentNomination');
const asyncHandler = require("express-async-handler");
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

// Controller functions
exports.submitPrivateNomination = async (req, res) => { 
    try {
        await runMiddleware(req, res,myUploadMiddleware);
        
        const {
            name,
            company,
            designation,
            email,
            phone,
            website,
            gst,
            category
        } = req.body;

        const newNomination = new PrivateNomination({
            name,
            company,
            designation,
            email,
            phone,
            website,
            gst,
            category
        });

        await newNomination.save();
        res.status(200).json({ message: 'Private nomination submitted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to submit private nomination.' });
    }
};

exports.submitGovernmentNomination = async (req, res) => {
   
    try {
        await runMiddleware(req, res,myUploadMiddleware);
        
        const {
            name,
            department,
            designation,
            email,
            phone,
            website,
            presentationFiles,
            category
        } = req.body;

        const newNomination = new GovernmentNomination({
            name,
            department,
            designation,
            email,
            phone,
            website,
            presentationFiles,
            category
        });

        await newNomination.save();
        res.status(200).json({ message: 'Government nomination submitted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to submit government nomination.' });
    }
};
