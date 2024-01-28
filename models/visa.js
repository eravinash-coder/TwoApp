const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  countryName:String,
  fname: String,

  lname: String,

  email: String,

  phone: String,

  visaType: String,

  address: String,

  city: String,

  state: String,

  country: String,

  zipcode: String,
  images: [{
    url: String

  }],
  passport:[{
    url: String

  }],
  bankstatement:[{
    url: String
    
  }],
  hotelbooking:[{
    url: String
    
  }],
  flightbook:[{
    url: String
    
  }],
  travelInsurance:[{
    url: String
    
  }],
  ITR:[{
    url: String
    
  }],
  iternnary:[{
    url: String
    
  }],
  marriage:[{
    url: String
    
  }],
  invitationletter:[{
    url: String
    
  }]

});

module.exports = mongoose.model('Visa', visaSchema);
