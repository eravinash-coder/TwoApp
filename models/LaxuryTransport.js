const mongoose = require('mongoose');

const LaxuryTransportSchema = new mongoose.Schema({

    fname: String,

    lname: String,

    phone: String,

    brandOfVehicle: String,

    numberOfPeople: String,

    luxury: String,

    sluxury: String,

    address: String
});

module.exports = mongoose.model('LaxuryTransport', LaxuryTransportSchema);
