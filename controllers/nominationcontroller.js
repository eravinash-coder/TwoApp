// nomination.controller.js

const PrivateNomination = require('../models/privateNomination');
const GovernmentNomination = require('../models/governmentNomination');
const Vote = require('../models/voteModal');
const asyncHandler = require("express-async-handler");
const Nomination = require("../models/nominationModal");
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
    // try {
    //     await runMiddleware(req, res,myUploadMiddleware);
        
    //     const {
    //         name,
    //         company,
    //         designation,
    //         email,
    //         phone,
    //         website,
    //         gst,
    //         category
    //     } = req.body;

    //     const newNomination = new PrivateNomination({
    //         name,
    //         company,
    //         designation,
    //         email,
    //         phone,
    //         website,
    //         gst,
    //         category
    //     });

    //     await newNomination.save();
    //     res.status(200).json({ message: 'Private nomination submitted successfully.' });
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Failed to submit private nomination.' });
    // }
    try {
      const ads = await PrivateNomination.find();
      res.status(200).json(ads);
    } catch (err) {
      res.status(500).json({ message: err.message });
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
exports.submitVote = async (req, res) => {
   
  try {
      await runMiddleware(req, res,myUploadMiddleware);
      const {
          name,
          email,
          phone,
          airport
      } = req.body;

      const vote = new Vote({
        name,
        email,
        phone,
        airport
      });

      await vote.save();
      res.status(200).json({ message: 'Government nomination submitted successfully.' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to submit government nomination.' });
  }
};

exports.create = async (req, res) => {
  try {
      const nomination = new Nomination(req.body);
      await nomination.save();
      res.status(201).json(nomination);
  } catch (err) {
      console.error('Error creating nomination:', err);
      res.status(400).json({ message: 'Error creating nomination.' });
  }
};

// Read all nominations
exports.findAll = async (req, res) => {
    try {
        const nominations = await Nomination.find({}).exec();
        if (nominations.length === 0) {
            return res.status(404).json({ message: 'No nominations found.' });
        }
        res.json(nominations);
    } catch (err) {
        console.error('Error finding all nominations:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Read a single nomination by ID
exports.findById = async (req, res) => {
    try {
        const nomination = await Nomination.findById(req.params.id).exec();
        if (!nomination) {
            return res.status(404).json({ message: 'Nomination not found.' });
        }
        res.json(nomination);
    } catch (err) {
        console.error('Error finding nomination by ID:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Update a nomination by ID
exports.update = async (req, res) => {
    try {
        const nomination = await Nomination.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
        if (!nomination) {
            return res.status(404).json({ message: 'Nomination not found.' });
        }
        res.json(nomination);
    } catch (err) {
        console.error('Error updating nomination:', err);
        res.status(400).json({ message: 'Error updating nomination.' });
    }
};

// Delete a nomination by ID
exports.delete = async (req, res) => {
    try {
        const nomination = await Nomination.findByIdAndDelete(req.params.id).exec();
        if (!nomination) {
            return res.status(404).json({ message: 'Nomination not found.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting nomination:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.findByCategory = async (req, res) => {
  try {
      // Decode the category from URL and trim any leading/trailing spaces
      const category = decodeURIComponent(req.params.category).trim();

      console.log(`Searching for category: "${category}"`);  // Add this line for debugging

      // Find nominations with a case-insensitive match
      const nominations = await Nomination.find({
          Categories: { $regex: new RegExp(`^${category}$`, 'i') }
      }).exec();

      if (nominations.length === 0) {
          return res.status(404).json({ message: 'No nominations found for this category.' });
      }

      res.json(nominations);
  } catch (err) {
      console.error('Error finding nominations by category:', err);
      res.status(500).json({ message: 'Internal server error.' });
  }
};
