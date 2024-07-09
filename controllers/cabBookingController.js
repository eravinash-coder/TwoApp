const Cab = require('../models/cabBookingModel');

// Get all cabs
exports.getAllCabs = async (req, res) => {
  try {
    const cabs = await Cab.find({ isBooked: false });
    res.status(200).json({success: true, data: cabs});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific cab by ID
exports.getCabById = async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);
    if (!cab) return res.status(404).json({ message: 'Cab not found' });
    res.json(cab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new cab
exports.createCab = async (req, res) => {
  const cab = new Cab({
    fname: req.body.fname,
    lname: req.body.lname,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode
  });

  try {
    const newCab = await cab.save();
    res.status(201).json(newCab);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a cab
exports.updateCab = async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);
    if (!cab) return res.status(404).json({ message: 'Cab not found' });

    Object.keys(req.body).forEach(key => {
      cab[key] = req.body[key];
    });

    const updatedCab = await cab.save();
    res.json(updatedCab);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a cab
exports.deleteCab = async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);
    if (!cab) return res.status(404).json({ message: 'Cab not found' });

    await cab.remove();
    res.json({ message: 'Cab deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
