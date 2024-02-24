const mongoose = require('mongoose');

const ufftaSchema = new mongoose.Schema({
  name: String,
  cname: String,
  email: String,
  phone: String,
  address: String,
  isVerified: {
    type: 'Boolean',
    default: false
  }


});

module.exports = mongoose.model('UFFTA', ufftaSchema);
