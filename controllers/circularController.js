const Circular = require('../models/Circular');
const Member = require('../models/Member');
const Association = require('../models/Association');

exports.postCircular = async (req, res) => {
  try {
    const { associationId, content } = req.body;
     console.log(content)
     console.log(associationId);
    const associationExists = await Association.findById(associationId);
    console.log(associationExists);
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

    const circular = new Circular({ associationId, content });
    await circular.save();
    res.status(201).send('Circular posted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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
    res.send(circulars);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
