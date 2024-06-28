const StackHolder = require('../models/StackHolderModal');
const asyncHandler = require("express-async-handler");



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
exports.addStackHolder = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const { pppId, type, fname,lname,cname,website,email,phone,address,City,pincode,description} = req.body;
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
    var stackHolder = new StackHolder({
        pppId, type, fname,lname,cname,website,email,phone,address,City,pincode,description,
        Document: imageObjects
    });
  
    var record = await stackHolder.save();
  
    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "StackHolder Added Successfully!",
      data: record,
    });
  
  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }
  
});

// exports.editPPP = asyncHandler(async (req, res) => {
//   try {
    
//     await runMiddleware(req, res, myUploadMiddleware);
//     const { name, type, email , password} = req.body;
//     let ppp = await PPP.findById(req.params.id);
  
    
//     let imageObjects;
    
    

//     if (req.files && req.files['image']) {
//       imageObjects = await Promise.all(
//         req.files['image'].map(async (file) => {
//           const b64 = Buffer.from(file.buffer).toString('base64');
//           const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
//           return handleUpload(dataURI);
//         })
//       );
//     }
    
//     ppp.name = name;
//     ppp.type = type;
//     ppp.email=email;
//     ppp.image=imageObjects;
//     ppp.password=password;


//    await ppp.save();

//     // Send success response inside the try block
//     res.status(201).json({
//       success: true,
//       msg: "Successfully Updated PPP",
      
//     });

//   } catch (error) {
//     // Send error response inside the catch block
//     res.status(400).json({ success: false, msg: error.message });
//   }
// });



// // Get all PPP documents
// exports.getAllPPP = async (req, res) => {
//   try {
//     const ppps = await PPP.find();
//     res.json({
//       success: true,
//       data: ppps,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// exports.getPPPById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const ppp = await PPP.findById(id);
//     if (!ppp) {
//       return res.status(404).json({ error: 'PPP not found' });
//     }
//     res.json({
//       success: true,
//       data: ppp,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deletePPPById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedPPP = await PPP.findByIdAndDelete(id);
//     if (!deletedPPP) {
//       return res.status(404).json({ error: 'PPP not found' });
//     }
//     res.status(200).json({ message: 'PPP deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Controller function to get only the names
exports.getStackHolderByPPPId = async (req, res) => {
  try {
    const { pppId } = req.params;
    const stackHolder = await StackHolder.find({pppId});
    res.status(200).json({
        success: true,
        data: stackHolder,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving names', error });
  }
};

