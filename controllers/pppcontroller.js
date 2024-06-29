const PPP = require('../models/ppp');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

const secret = 'your_jwt_secret'; // Store this in a secure place



const multer = require('multer');

const handleUpload = require('../helpers/upload')
const handleUploadpdf = require('../helpers/uploadPdf')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.fields([
  { name: 'pdf', maxCount: 10 },
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
exports.addPolicy = asyncHandler(async (req, res,) => {
  try {
    await runMiddleware(req, res,myUploadMiddleware);
    const { id } = req.params;
    console.log(req.body);
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
    console.log(error.message );
  }
});

exports.getPolicies = async (req, res) => {
  try {
    const { id } = req.params;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    res.status(200).json({
      success: true,
      data: ppp.tourismpolicy,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get policy by ID
exports.getPolicyById = async (req, res) => {
  try {
    const { id, policyId } = req.params;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    const policy = ppp.tourismpolicy.id(policyId);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update policy
exports.updatePolicy = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res,myUploadMiddleware);
    const { id, policyId } = req.params;
    const policyUpdates = req.body;
    console.log(policyUpdates);
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    const policy = ppp.tourismpolicy.id(policyId);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    Object.assign(policy, policyUpdates);
    await ppp.save();
    res.status(200).json(ppp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete policy
exports.deletePolicy = async (req, res) => {
  try {
    const { id, policyId } = req.params;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    const policy = ppp.tourismpolicy.id(policyId);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    policy.remove();
    await ppp.save();
    res.status(200).json(ppp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add an investment opportunity to a PPP document
exports.addInvestmentOpportunity = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res,myUploadMiddleware);
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
});

exports.getInvestmentOpportunities = async (req, res) => {
  try {
    const { id } = req.params;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    res.status(200).json({
      success: true,
      data: ppp.investmentOpportunity,
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get investment opportunity by ID
exports.getInvestmentOpportunityById = async (req, res) => {
  try {
    const { id, opportunityId } = req.params;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    const opportunity = ppp.investmentOpportunity.id(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ error: 'Investment Opportunity not found' });
    }
    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update investment opportunity
exports.updateInvestmentOpportunity = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res,myUploadMiddleware);
    const { id, opportunityId } = req.params;
    const opportunityUpdates = req.body;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    const opportunity = ppp.investmentOpportunity.id(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ error: 'Investment Opportunity not found' });
    }
    Object.assign(opportunity, opportunityUpdates);
    await ppp.save();
    res.status(200).json(ppp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete investment opportunity
exports.deleteInvestmentOpportunity = async (req, res) => {
  try {
    const { id, opportunityId } = req.params;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    const opportunity = ppp.investmentOpportunity.id(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ error: 'Investment Opportunity not found' });
    }
    opportunity.remove();
    await ppp.save();
    res.status(200).json(ppp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.addimage = asyncHandler(async (req, res,) => {
  try {
    await runMiddleware(req, res,myUploadMiddleware);
    const { id } = req.params;
    console.log(req.files);
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
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    console.log(imageObjects);
    ppp.resorceimage.push({ image: imageObjects });
    await ppp.save();
    res.status(200).json(ppp);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message );
  }
});
exports.getimage = async (req, res) => {
  try {
    const { id } = req.params;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    res.status(200).json({
      success: true,
      data: ppp.resorceimage,
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.addvideo = asyncHandler(async (req, res,) => {
  try {
    await runMiddleware(req, res,myUploadMiddleware);
    const { id } = req.params;
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
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    console.log(imageObjects);
    ppp.resorcevideo.push({ video: imageObjects });
    await ppp.save();
    res.status(200).json(ppp);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message );
  }
});
exports.getvideo = async (req, res) => {
  try {
    const { id } = req.params;
    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }
    res.status(200).json({
      success: true,
      data: ppp.resorcevideo,
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addpdf = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const { id } = req.params;
    let pdfObjects = [];
    
    if (req.files && req.files['pdf']) {
      pdfObjects = await Promise.all(
        req.files['pdf'].map(async (file) => {
          try {
            const result = await handleUploadpdf(file.buffer);
            return result;
          } catch (uploadError) {
            console.error(`Failed to upload ${file.originalname}:`, uploadError);
            return null;
          }
        })
      );
      // Filter out any null results due to upload failures
      pdfObjects = pdfObjects.filter(url => url !== null);
    }
    
    console.log(pdfObjects);

    const ppp = await PPP.findById(id);
    if (!ppp) {
      return res.status(404).json({ error: 'PPP not found' });
    }

    ppp.resorcepdf.push({ pdf: pdfObjects });
    await ppp.save();
    res.status(200).json(ppp);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
});

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


// Controller function to get only the names
exports.getPPPNams = async (req, res) => {
  try {
    // Find all documents and select only the 'name' field
    const names = await PPP.find({}, 'name');
    res.status(200).json(names);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving names', error });
  }
};

