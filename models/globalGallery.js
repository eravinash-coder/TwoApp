const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  category:String,
  urlToImage:[Object],
  

});

module.exports = mongoose.model('globalGallery', adSchema);
