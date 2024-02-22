const jwt = require('jsonwebtoken');
const Association = require('../models/Association');
const Member = require('../models/Member');
const Laxury = require('../models/Luxury');

const authAssoMiddleware = async (req, res, next) => {

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized');
    }
    const decoded = jwt.verify(token, 'userNewsApp');
    // Check if the user is an association
    if (decoded.associationId) {
      const association = await Association.findById(decoded.associationId);
      if (!association) {
        return res.status(401).send('Unauthorized');
      }
      req.user = { role: 'association', associationId: decoded.associationId };
    }

    // Check if the user is a member
    if (decoded.memberId) {
      const member = await Member.findById(decoded.memberId);

      if (!member) {
        return res.status(401).send('Unauthorized');
      }
      req.user = { role: 'member', memberId: decoded.memberId };
    }
    if (decoded.luxuryId) {
      const laxury = await Laxury.findById(decoded.luxuryId);

      if (!laxury) {
        return res.status(401).send('Unauthorized');
      }
      req.user = { role: 'luxury', laxuryId: decoded.luxuryId };
    }
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

module.exports = authAssoMiddleware;
