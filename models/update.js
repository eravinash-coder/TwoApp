const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  title: String,
  content: String,
  urlToImage:String,
  addedAt:Date

});

module.exports = mongoose.model('Update', updateSchema);
