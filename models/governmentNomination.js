// governmentNomination.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const governmentNominationSchema = new Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    category: { type: String, required: true }
});

module.exports = mongoose.model('GovernmentNomination', governmentNominationSchema);
