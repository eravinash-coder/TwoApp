const DMC = require('../models/dmcModel');

// Create DMC
exports.createDMC = async (req, res) => {
  try {
    const dmc = new DMC(req.body);
    await dmc.save();
    res.status(201).json(dmc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all DMCs
exports.getAllDMCs = async (req, res) => {
  try {
    const dmcs = await DMC.find();
    res.json(dmcs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get DMC by ID
exports.getDMCById = async (req, res) => {
  try {
    const dmc = await DMC.findById(req.params.id);
    if (!dmc) {
      return res.status(404).json({ message: 'DMC not found' });
    }
    res.json(dmc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update DMC by ID
exports.updateDMC = async (req, res) => {
  try {
    const dmc = await DMC.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dmc) {
      return res.status(404).json({ message: 'DMC not found' });
    }
    res.json(dmc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete DMC by ID
exports.deleteDMC = async (req, res) => {
  try {
    const dmc = await DMC.findByIdAndDelete(req.params.id);
    if (!dmc) {
      return res.status(404).json({ message: 'DMC not found' });
    }
    res.json({ message: 'DMC deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify DMC by ID
exports.verifyDMC = async (req, res) => {
  try {
    const dmc = await DMC.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!dmc) {
      return res.status(404).json({ message: 'DMC not found' });
    }
    res.json(dmc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
