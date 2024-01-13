const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  name: String,
  email: String,
  password: String,
});

module.exports = mongoose.model('Member', memberSchema);
