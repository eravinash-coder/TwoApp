const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  name: String,
  email: String,
  password: String,
  favoritesHotel:[{type: mongoose.Schema.Types.ObjectId,ref: 'Hotel'}],
  favoritesTransport:[{type: mongoose.Schema.Types.ObjectId,ref: 'Transport'}],
  favoritesPackage:[{type: mongoose.Schema.Types.ObjectId,ref: 'Package'}]

});

module.exports = mongoose.model('Member', memberSchema);
