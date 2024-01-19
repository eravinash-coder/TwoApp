const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Upload = require("../helpers/upload");
const { has } = require('lodash');





exports.register = asyncHandler(async (req, res) => {
  const { name, type, shortName, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Upload the file and get the secure URL
    const upload = await Upload.uploadFile(req.file.path);

    // Create a new Association instance
    const association = new Association({
      name,
      type,
      shortName,
      email,
      password: hashedPassword,
      image: upload.secure_url,
    });

    // Save the association record to the database
    const record = await association.save();

    res.status(201).json({
      success: true,
      msg: 'Association Uploaded Successfully!',
      data: record,
    });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log("Login Request Body:", req.body);

    // Find association by email
    const association = await Association.findOne({ email });

    // console.log("Found Association:", association);

    if (!association || !(await bcrypt.compare(password, association.password))) {
      // console.error("Invalid login credentials");
      throw new Error('Invalid login credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ associationId: association._id }, 'userNewsApp');

    

    res.send({ token });
  } catch (error) {
    // console.error("Login Error:", error.message);
    res.status(401).send(error.message);
  }
};

exports.getAllAssociations = async (req, res) => {
  try {
    const associations = await Association.find();

    // Transform data before sending the response
    const transformedAssociations = associations.map(association => ({
      name: association.shortName,
      id: association._id.toString(), // Assuming you want the id as a string
      atype: association.type,
      logo : association.image
    }));

    // Create an object with the "association" property
    const responseData = { association: transformedAssociations };

    res.send([responseData]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
