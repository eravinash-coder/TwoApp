const Visa = require('../models/visa');
const asyncHandler = require("express-async-handler");
const multer = require('multer');
const { send } = require('../utils/mailer');
const handleUpload = require('../helpers/upload')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.fields([
  { name: 'documentUrl', maxCount: 10 },
  { name: 'passport_documentUrl', maxCount: 10 },
  { name: 'bankstatement_documentUrl', maxCount: 10 },
  { name: 'hotelbooking_documentUrl', maxCount: 10 },
  { name: 'flightbook_documentUrl', maxCount: 10 },
  { name: 'travelInsurance_documentUrl', maxCount: 10 },
  { name: 'ITR_documentUrl', maxCount: 10 },
  { name: 'iternnary_documentUrl', maxCount: 10 },
  { name: 'marriage_certificate', maxCount: 10 },
  { name: 'invitationletter_documentUrl', maxCount: 10 },
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

exports.addVisa = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);

    const {
      countryName,
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
      let imageObjects,passportObjects,bankstatementObjects,hotelbookingObjects,flightbookObjects,travelInsuranceObjects,ITRObjects,iternnaryObjects,marriageObjects,invitationletterObjects;

    if (req.files && req.files['documentUrl']) {
      imageObjects = await Promise.all(
        req.files['documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['passport_documentUrl']) {
      passportObjects = await Promise.all(
        req.files['passport_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['bankstatement_documentUrl']) {
      passportObjects = await Promise.all(
        req.files['bankstatement_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['hotelbooking_documentUrl']) {
      passportObjects = await Promise.all(
        req.files['hotelbooking_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['flightbook_documentUrl']) {
      passportObjects = await Promise.all(
        req.files['flightbook_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['travelInsurance_documentUrl']) {
      passportObjects = await Promise.all(
        req.files['travelInsurance_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['ITR_documentUrl']) {
      passportObjects = await Promise.all(
        req.files['ITR_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['iternnary_documentUrl']) {
      passportObjects = await Promise.all(
        req.files['iternnary_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['marriage_certificate']) {
      passportObjects = await Promise.all(
        req.files['marriage_certificate'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['invitationletter_documentUrl']) {
      passportObjects = await Promise.all(
        req.files['invitationletter_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }

    const visa = new Visa({
      countryName,
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
      passport: passportObjects,
      bankstatement: bankstatementObjects,
      hotelbooking: hotelbookingObjects,
      flightbook: flightbookObjects,
      travelInsurance: travelInsuranceObjects,
      ITR: ITRObjects,
      iternnary: iternnaryObjects,
      marriage: marriageObjects,
      invitationletter: invitationletterObjects

    });

    const savedVisa = await visa.save();
    if (savedVisa) {
      const to = 'infotravelworldonline@gmail.com'; // Set the recipient's email address
      const subject = 'New Visa Request';
      const html = `<p>The visa details have been successfully saved:</p><p>${JSON.stringify(savedVisa)}</p>`;
      await send(to, subject, html);
    }

    res.json({
      message: 'Upload successful',
      data: savedVisa,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});
