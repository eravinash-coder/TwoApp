// privateNomination.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privateNominationSchema = new Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String, required: true },
    gst: { type: String },
    category: { type: String, required: true }
});

module.exports = mongoose.model('PrivateNomination', privateNominationSchema);
