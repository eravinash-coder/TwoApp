const mongoose = require('mongoose');

const ChaptersSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  urlToImage: [Object],
  name:String,
  post:String,
  email:String,
  phone:String,
  location:String
  

});

module.exports = mongoose.model('Chapters', ChaptersSchema);
