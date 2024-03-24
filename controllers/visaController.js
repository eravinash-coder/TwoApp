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
    let imageObjects, passportObjects, bankstatementObjects, hotelbookingObjects, flightbookObjects, travelInsuranceObjects, ITRObjects, iternnaryObjects, marriageObjects, invitationletterObjects;

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
      bankstatementObjects = await Promise.all(
        req.files['bankstatement_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['hotelbooking_documentUrl']) {
      hotelbookingObjects = await Promise.all(
        req.files['hotelbooking_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['flightbook_documentUrl']) {
      flightbookObjects = await Promise.all(
        req.files['flightbook_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['travelInsurance_documentUrl']) {
      travelInsuranceObjects = await Promise.all(
        req.files['travelInsurance_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['ITR_documentUrl']) {
      ITRObjects = await Promise.all(
        req.files['ITR_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['iternnary_documentUrl']) {
      iternnaryObjects = await Promise.all(
        req.files['iternnary_documentUrl'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['marriage_certificate']) {
      marriageObjects = await Promise.all(
        req.files['marriage_certificate'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    if (req.files && req.files['invitationletter_documentUrl']) {
      invitationletterObjects = await Promise.all(
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
      const to = 'Raghav@dudigitalglobal.com';
      const cc = 'info@travelworldonline.in';
      const subject = 'New Visa Request';

      const formattedImages = savedVisa.images.map(image => `<img src="${image}" alt="Uploaded Image" style="max-width: 300px;"/>`).join('<br/>');
      
      
      const formattedPassportDocs = savedVisa.passport.map(passportDoc => `<img src="${passportDoc}" alt="Passport Document Image" style="max-width: 300px;"/>`).join('<br/>');
      
      
      const formattedBankStatements = savedVisa.bankstatement.map(bankStatement => `<img src="${bankStatement}" alt="Bank Statement Image" style="max-width: 300px;"/>`).join('<br/>');
      
      
      const formattedHotelBookings = savedVisa.hotelbooking.map(hotelBooking => `<img src="${hotelBooking}" alt="Hotel Booking Image" style="max-width: 300px;"/>`).join('<br/>');
      
      
      const formattedFlightBookings = savedVisa.flightbook.map(flightBooking => `<img src="${flightBooking}" alt="Flight Booking Image" style="max-width: 300px;"/>`).join('<br/>');
     
      
      const formattedTravelInsuranceDocs = savedVisa.travelInsurance.map(travelInsurance => `<img src="${travelInsurance}" alt="Travel Insurance Image" style="max-width: 300px;"/>`).join('<br/>');
   
      
      const formattedITRDocs = savedVisa.ITR.map(ITRDoc => `<img src="${ITRDoc}" alt="ITR Document Image" style="max-width: 300px;"/>`).join('<br/>');
      
      
      const formattedItineraryDocs = savedVisa.iternnary.map(iternnaryDoc => `<img src="${iternnaryDoc}" alt="Itinerary Document Image" style="max-width: 300px;"/>`).join('<br/>');
     
      
      const formattedMarriageCertificates = savedVisa.marriage.map(marriageCertificate => `<img src="${marriageCertificate}" alt="Marriage Certificate Image" style="max-width: 300px;"/>`).join('<br/>');
      

      const formattedInvitationLetters = savedVisa.invitationletter.map(invitationLetter => `<img src="${invitationLetter}" alt="Invitation Letter Image" style="max-width: 300px;"/>`).join('<br/>');
    
      const formattedVisaDetails = `
        <p><strong>Visa Details:</strong></p>
        <p><strong>Country Name:</strong> ${savedVisa.countryName}</p>
        <p><strong>First Name:</strong> ${savedVisa.fname}</p>
        <p><strong>Last Name:</strong> ${savedVisa.lname}</p>
        <p><strong>Email:</strong> ${savedVisa.email}</p>
        <p><strong>Phone:</strong> ${savedVisa.phone}</p>
        <p><strong>Visa Type:</strong> ${savedVisa.visaType}</p>
        <p><strong>Address:</strong> ${savedVisa.address}</p>
        <p><strong>City:</strong> ${savedVisa.city}</p>
        <p><strong>State:</strong> ${savedVisa.state}</p>
        <p><strong>Country:</strong> ${savedVisa.country}</p>
        <p><strong>Zipcode:</strong> ${savedVisa.zipcode}</p>
        <!-- Include other fields similarly -->

        <!-- Include formatted image fields -->
        <p><strong>Images:</strong><br/>${formattedImages}</p>
        <p><strong>Passport Documents:</strong><br/>${formattedPassportDocs}</p>
        <p><strong>Bank Statements:</strong></p>
        ${formattedBankStatements}

        <p><strong>Hotel Bookings:</strong></p>
        ${formattedHotelBookings}

        <p><strong>Flight Bookings:</strong></p>
        ${formattedFlightBookings}

        <p><strong>Travel Insurance Documents:</strong></p>
        ${formattedTravelInsuranceDocs}

        <p><strong>ITR Documents:</strong></p>
        ${formattedITRDocs}

        <p><strong>Itinerary Documents:</strong></p>
        ${formattedItineraryDocs}

        <p><strong>Marriage Certificates:</strong></p>
        ${formattedMarriageCertificates}

        <p><strong>Invitation Letters:</strong></p>
         ${formattedInvitationLetters}`;

      const html = `<p>The visa details have been successfully saved:</p>${formattedVisaDetails}`;

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
