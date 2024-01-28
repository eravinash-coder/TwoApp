const mongoose = require('mongoose');

const luxuryCruiseSchema = new mongoose.Schema({


    fname:String,

    lname:String,

    phone:String,

    email:String,

    destination:String,

    departurePort:String,

    LenghtOfTour:String
});

module.exports = mongoose.model('luxuryCruise', luxuryCruiseSchema);
