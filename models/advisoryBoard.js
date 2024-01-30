const mongoose = require('mongoose');

const advisoryBoardSchema = new mongoose.Schema({
  name:String,
  post:String,
  about:String,
  images: [Object],


});

module.exports = mongoose.model('advisoryBoard', advisoryBoardSchema);
