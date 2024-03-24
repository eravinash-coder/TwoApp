const DMC = require('../models/dmc');
const Member = require('../models/Member');
const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");
const multer = require('multer');
const { send } = require('../utils/mailer');

const handleUpload = require('../helpers/upload')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.fields([
  { name: 'image', maxCount: 10 },
  { name: 'document', maxCount: 10 }
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

exports.addDMC = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);

    const {
      name,
      cname,
      email,
      phone,
      address,
      specialization, } = req.body; 
    const associationId = '65d6cbde7ebd64000882efec';
    const firstName = name.split(' ')[0];
    const password =firstName+"@12345";
    const hashedPassword = await bcrypt.hash(password, 10);
    const member = new Member({ associationId, name, email, password: hashedPassword });
   const memberSave= await  member.save();
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
    if (req.files && req.files['document']) {
      home_imageObjects = await Promise.all(
        req.files['document'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }

    const dmc = new DMC({

      name,
      cname,
      email,
      phone,
      address,
      specialization,
      photo: imageObjects,
      document: home_imageObjects


    });

     const Dmc= await dmc.save();
    if(memberSave){
      const to = email;
      const cc = 'akt7273922921@gmail.com';
      const subject = 'Login Password';
      const html = `Hello ${name},\n\nYour password for registration is: ${password} <br/> Thank you for registering with us. `;

      await send(to, subject, html);

    }
    res.json({
      message: 'Upload successful',
      data: Dmc,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Get all DMCs
exports.getAllDMCs = async (req, res) => {
  try {
    const dmcs = await DMC.find();
    res.json(dmcs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get DMC by ID
exports.getDMCById = async (req, res) => {
  try {
    const dmc = await DMC.findById(req.params.id);
    if (!dmc) {
      return res.status(404).json({ message: 'DMC not found' });
    }
    res.json(dmc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update DMC by ID
exports.updateDMC = async (req, res) => {
  try {
    const dmc = await DMC.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dmc) {
      return res.status(404).json({ message: 'DMC not found' });
    }
    res.json(dmc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete DMC by ID
exports.deleteDMC = async (req, res) => {
  try {
    const dmc = await DMC.findByIdAndDelete(req.params.id);
    if (!dmc) {
      return res.status(404).json({ message: 'DMC not found' });
    }
    res.json({ message: 'DMC deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify DMC by ID
exports.verifyDMC = async (req, res) => {
  try {
    const dmc = await DMC.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!dmc) {
      return res.status(404).json({ message: 'DMC not found' });
    }
    res.json(dmc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
