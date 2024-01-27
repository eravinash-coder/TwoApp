const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
    
    fname :String,
    
    lname :String,
    
    email :String,
    
    phone :String,
    
    visaType :String,
    
    address :String,
    
    city :String,
    
    state :String,
    
    country :String,
    
    zipcode :String,
    images: [{
        url: String
        
      }]

});

module.exports = mongoose.model('Visa', visaSchema);
