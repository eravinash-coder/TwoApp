const PPP = require('../models/ppp');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

const secret = 'your_jwt_secret'; // Store this in a secure place



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

// Register a new user
exports.register = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const { name, type, email, password } = req.body;
    const userExists = await PPP.findOne({ email });
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
    var ppp = new PPP({
      name,
      type,
      email,
      password, 
      image: imageObjects
    });
  
    var record = await ppp.save();
  
    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "PPP Added Successfully!",
      data: record,
    });
  
  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }
  
});

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await PPP.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.editPPP = asyncHandler(async (req, res) => {
  try {
    
    await runMiddleware(req, res, myUploadMiddleware);
    const { name, type, email , password} = req.body;
    let ppp = await PPP.findById(req.params.id);
  
    
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
    
    ppp.name = name;
    ppp.type = type;
    ppp.email=email;
    ppp.image=imageObjects;
    ppp.password=password;


   await ppp.save();

    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "Successfully Updated PPP",
      
    });

  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }
});
// Add a policy to a PPP document
exports.addPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = req.body;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    ppp.tourismpolicy.push(policy);
    await ppp.save();
    res.status(200).json(ppp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add an investment opportunity to a PPP document
exports.addInvestmentOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const opportunity = req.body;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    ppp.investmentOpportunity.push(opportunity);
    await ppp.save();
    res.status(200).json(ppp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Get all PPP documents
exports.getAllPPP = async (req, res) => {
  try {
    const ppps = await PPP.find();
    res.json({
      success: true,
      data: ppps,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getPPPById = async (req, res) => {
  try {
    const { id } = req.params;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    res.json({
      success: true,
      data: ppp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePPPById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPPP = await PPP.findByIdAndDelete(id);
    if (!deletedPPP) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    res.status(200).json({ message: 'PPP deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
