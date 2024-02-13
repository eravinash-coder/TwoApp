const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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


exports.register = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const { name, type, shortName, email, password } = req.body;
    const userExists = await Association.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        msg: 'Entered email id already registered with us. Login to continue'
      })
    }
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
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log
    var association = new Association({
      name,
      type,
      shortName,
      email,
      password: hashedPassword,
      image: imageObjects
    });
  
    var record = await association.save();
  
    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "Association Uploaded Successfully!",
      data: record,
    });
  
  } catch (error) {
    // Send error response inside the catch block
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

exports.getAssociationById = asyncHandler(async (req, res) => {
  const association = await Association.findById(req.params.associationId)
    

  

  res.json({
    success: true,
    data: association,
  });
 
});


exports.getAssociaton = asyncHandler(async (req, res) => {
  

  let association = await Association.find({});


  
  res.json({
    success: true,
    data: association,
  });
});

exports.editAssociation = asyncHandler(async (req, res) => {
  try {
    
    await runMiddleware(req, res, myUploadMiddleware);
    const { name, type, shortName, email , password} = req.body;
    console.log(req.body);
    let association = await Association.findById(req.params.associationId);
    

    
    let imageObjects;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    if (req.files && req.files['image']) {
      imageObjects = await Promise.all(
        req.files['image'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
    
    association.name = name;
    association.shortName=shortName;
    association.type = type;
    association.email=email;
    association.image=imageObjects;
    association.password=hashedPassword;


   await association.save();

    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "Successfully Updated Association",
      
    });

  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }
});


exports.deleteAssociation = asyncHandler(async (req, res) => {
  
  const association = await Association.findByIdAndDelete(req.params.associationId);

  if (!association) {
    return res.status(401).json({
      success: false,
      msg: 'Association not found.'
    });
  }

  res.status(201).json({
    success: true,
    msg: 'Successfully Deleted',
    data: association
  });
});