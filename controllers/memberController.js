const Member = require('../models/Member');
const Association = require('../models/Association');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { associationId, name, email, password } = req.body;

    const associationExists = await Association.findById(associationId);
    if (!associationExists) {
      return res.status(404).send('Association not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const member = new Member({ associationId, name, email, password: hashedPassword });
    await member.save();
    res.status(201).send('Member registered successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { associationId, email, password } = req.body;
   
    const member = await Member.findOne({ email });
    if (associationId && String(member.associationId) !== associationId) {
      throw new Error('Member does not belong to the specified association');
    }

    if (!member || !(await bcrypt.compare(password, member.password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ memberId: member._id }, 'userNewsApp');
    res.send({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
};
