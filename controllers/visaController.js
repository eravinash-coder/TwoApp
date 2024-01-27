const Visa = require('../models/visa');
const asyncHandler = require("express-async-handler");
const Upload = require("../helpers/upload");


exports.addVisa = asyncHandler(async (req, res) => {
  const {
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

    dob } = req.body;
  try {



    const upload = await Upload.uploadFile(req.file.path);
    var visa = new Visa({
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

      dob,
      urlToImage: upload.secure_url
    });
    var record = await visa.save();

    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "Successfully Added Visa",
      data: record,
    });

  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }


});