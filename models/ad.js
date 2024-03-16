const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
 
  place: String,
  hitUrl: String,
  urlToImage:[Object],
  

});

module.exports = mongoose.model('Ad', adSchema);
