const Circular = require('../models/Circular');
const Member = require('../models/Member');
const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");
const Upload = require("../helpers/upload");

exports.addCircular = asyncHandler(async (req, res) => {
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
    var circular = new Circular({
      associationId,
      title,
      content,
      urlToImage: upload.secure_url,
      addedAt: Date.now(),
    });
    var record = await circular.save();

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

exports.getCirculars = async (req, res) => {
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

    const circulars = await Circular.find({ associationId });
    const transformedCirculars = circulars.map(circular => ({
      id: circular._id.toString(),  // Assuming you want the id as a string
      title: circular.title,
      content: circular.content,
      image: circular.urlToImage,
      date: circular.addedAt
    }));

    // Create an object with the "association" property
    const responseData = { circular: transformedCirculars };

    res.send([responseData]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
