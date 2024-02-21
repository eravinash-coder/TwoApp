const mongoose = require('mongoose');

const dmcSchema = new mongoose.Schema({
  name: String,
  cname: String,
  email: String,
  phone: String,
  address: String,
  specialization: String,
  photo: [Object],
  document: [Object],
  isVerified: {
    type: 'Boolean',
    default: false
  }


});

module.exports = mongoose.model('DMC', dmcSchema);
