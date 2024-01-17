const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Upload = require("../helpers/upload");





exports.register = asyncHandler(async (req, res) => {
  // const imgUrl = await uploadImage(req.files)
  const {   name,type, shortName,email ,password } = req.body;
  // console.log("req.body", req.body);
  // console.log("req.files.images", req.files.image);
  try {
    const upload = await Upload.uploadFile(req.file.path);
    var association = new Association({
      name, 
      type,
      shortName,
      email ,
      password ,
      image: upload.secure_url,
      
      
    });
    var record = await association.save();
    res.send({ succes: true, msg: 'Association Uploaded Successfully!', data: record });

  } catch (error) {
    res.send({ succes: false, msg: error.message });
  }


  if (Association) {
    res.status(201).json({
      success: true,
      msg: "Successfully Added Association",
      data: Association,
    });
  } else {
    res.status(400);
    throw new Error("Invalid News data");
  }

  // console.log(bodyData)
  if (!req.files) {
    res.status(400).send("Select an Image.");
  } else {
  }
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const association = await Association.findOne({ email });

    if (!association || !(await bcrypt.compare(password, association.password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ associationId: association._id }, '7285692526');
    res.send({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
};
exports.getAllAssociations = async (req, res) => {
  try {
    const associations = await Association.find();

    // Transform data before sending the response
    const transformedAssociations = associations.map(association => ({
      
        _id: association._id,
        name: association.name,
        type: association.type,
        shortName: association.shortName,
        email: association.email,
        password: association.password,
        image: association.image,
        __v: association.__v
      
    }));

    // Create an object with the "association" property
    const responseData = { association: transformedAssociations };

    res.send(responseData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};