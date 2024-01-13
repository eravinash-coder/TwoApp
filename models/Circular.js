const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  content: String,
});

module.exports = mongoose.model('Circular', circularSchema);
