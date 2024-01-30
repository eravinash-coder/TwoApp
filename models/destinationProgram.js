const mongoose = require('mongoose');

const destinationProgramSchema = new mongoose.Schema({
  
  companyName: String,
  type: String,
  number:String,
  email:String

});

module.exports = mongoose.model('destinationProgram', destinationProgramSchema);
