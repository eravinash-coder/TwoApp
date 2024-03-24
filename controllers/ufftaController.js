const UFFTA = require('../models/uffta');
const Member = require('../models/Member');
const bcrypt = require('bcrypt');
const { send } = require('../utils/mailer');

exports.createUFFTA = async (req, res) => {
  try {
    const uffta = await UFFTA.create(req.body);
    res.status(201).json(uffta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUFFTA = async (req, res) => {
  try {
    const ufftaEntries = await UFFTA.find({ isVerified: false });
    res.json(ufftaEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUFFTAById = async (req, res) => {
  try {
    const uffta = await UFFTA.findById(req.params.id);
    if (!uffta) {
      return res.status(404).json({ message: 'UFFTA entry not found' });
    }
    res.json(uffta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUFFTAById = async (req, res) => {
  try {
    const uffta = await UFFTA.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!uffta) {
      return res.status(404).json({ message: 'UFFTA entry not found' });
    }
    const associationId = '65d94b77ad056d00084ac314';
    const name=uffta.name;
    const email=uffta.email;
    const firstName =name.split(' ')[0];
    const password =firstName+"@12345";
    const hashedPassword = await bcrypt.hash(password, 10);
    const member = new Member({ associationId, name, email, password: hashedPassword });
    const memberSave= await  member.save();
    if(memberSave){
      const to = email;
      const subject = 'Login Password';
      const html = `Hello ${name},\n\nYour password for registration is: ${password} <br/> Thank you for registering with us. `;

      await send(to,  subject, html);

    }
    res.json(memberSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUFFTAById = async (req, res) => {
  try {
    const uffta = await UFFTA.findByIdAndDelete(req.params.id);
    if (!uffta) {
      return res.status(404).json({ message: 'UFFTA entry not found' });
    }
    res.json({ message: 'UFFTA entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
