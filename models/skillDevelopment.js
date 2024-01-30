const mongoose = require('mongoose');

const skillDevelopmentSchema = new mongoose.Schema({
  
  companyName: String,
  type: String,
  number:String,
  email:String

});

module.exports = mongoose.model('skillDevelopment', skillDevelopmentSchema);
