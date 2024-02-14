const Update = require('../models/update');
const Member = require('../models/Member');
const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");
const Upload = require("../helpers/upload");

exports.addUpdate = asyncHandler(async (req, res) => {
  const { title, content, associationId } = req.body;
  try {
    const associationExists = await Association.findById(associationId);
    if (!associationExists) {
      return res.status(404).send('Association not found');
    }

    // Authentication middleware will verify if the user is the association
    // This check is simplified, and you might want to use a proper middleware
    // Check authMiddleware.js for the actual middleware
    const isAssociation = req.user && req.user.role === 'association';

    if (!isAssociation) {
      return res.status(403).send('Unauthorized');
    }
    const upload = await Upload.uploadFile(req.file.path);
    var update = new Update({
      associationId,
      title,
      content,
      urlToImage: upload.secure_url,
      addedAt: Date.now(),
    });
    var record = await update.save();

    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "Successfully Added News",
      data: record,
    });

  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }


});

exports.getUpdate = async (req, res) => {
  try {
    const associationId = req.params.associationId;

    const associationExists = await Association.findById(associationId);
    if (!associationExists) {
      return res.status(404).send('Association not found');
    }

    // Authentication middleware will verify if the user is a member of the association
    // This check is simplified, and you might want to use a proper middleware
    // Check authMiddleware.js for the actual middleware
    const isMember = req.user && req.user.role === 'member';

    if (!isMember) {
      return res.status(403).send('Unauthorized');
    }

    const Updates = await Update.find({ associationId });
    const transformedCirculars = Updates.map(Update => ({
      id: Update._id.toString(),  // Assuming you want the id as a string
      title: Update.title,
      content: Update.content,
      image: Update.urlToImage,
      date: Update.addedAt
    }));

    // Create an object with the "association" property
    const responseData = { Update: transformedCirculars };

    res.send([responseData]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllUpdate = asyncHandler(async (req, res) => {
  
  const associationId = req.user.associationId;
  console.log(associationId);
  let update = await Update.find({associationId});

 res.json({
   success: true,
   data: update,
 });
});

exports.editUpdate = asyncHandler(async (req, res) => {
  try {
    
    
    let member = await Member.findById(req.params.updateId);

    if (!member) {
        return res.status(401).json({
            success: false,
            msg: 'Category not found.'
        })
    }
    const { title, content } = req.body;
    member = await Member.findByIdAndUpdate(req.params.updateId, {title, content }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: member, msg: 'Successfully updated' });
    

  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }
});


exports.deleteUpdate = asyncHandler(async (req, res) => {
  
  const update = await Update.findByIdAndDelete(req.params.updateId);

  if (!update) {
    return res.status(401).json({
      success: false,
      msg: 'Member not found.'
    });
  }

  res.status(201).json({
    success: true,
    msg: 'Successfully Deleted',
    data: update
  });
});
 
exports.getUpdateById = asyncHandler(async (req, res) => {
  const update = await Update.findById(req.params.updateId)
  

  res.json({
    success: true,
    data: update,
  });
 
});