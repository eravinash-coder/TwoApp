const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema for individual policies
const PolicySchema = new mongoose.Schema({
  policyName: { type: String, required: true },
  policyDetails: { type: String, required: true }
});

// Define schema for individual investment opportunities
const InvestmentOpportunitySchema = new mongoose.Schema({
 
  opportunityName: { type: String, required: true },
  opportunityDetails: { type: String, required: true }
});

// Define the main schema
const PPPSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  image: [Object],
  tourismpolicy: [PolicySchema],
  investmentOpportunity: [InvestmentOpportunitySchema]
});

// Hash the password before saving
PPPSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
PPPSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('PPP', PPPSchema);
