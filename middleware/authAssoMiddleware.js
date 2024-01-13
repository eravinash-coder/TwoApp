const jwt = require('jsonwebtoken');
const Association = require('../models/Association');
const Member = require('../models/Member');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');

    // Check if the user is an association
    if (decoded.associationId) {
      const association = await Association.findById(decoded.associationId);
      if (!association) {
        return res.status(401).send('Unauthorized');
      }
      req.user = { role: 'association' };
    }

    // Check if the user is a member
    if (decoded.memberId) {
      const member = await Member.findById(decoded.memberId);
      if (!member) {
        return res.status(401).send('Unauthorized');
      }
      req.user = { role: 'member' };
    }

    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

module.exports = authMiddleware;
