const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  about:String
  

});

module.exports = mongoose.model('About', AboutSchema);
