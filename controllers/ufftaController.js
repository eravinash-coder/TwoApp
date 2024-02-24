const UFFTA = require('../models/uffta');

exports.createUFFTA = async (req, res) => {
  try {
    const uffta = await UFFTA.create(req.body);
    res.status(201).json(uffta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUFFTA = async (req, res) => {
  try {
    const ufftaEntries = await UFFTA.find();
    res.json(ufftaEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUFFTAById = async (req, res) => {
  try {
    const uffta = await UFFTA.findById(req.params.id);
    if (!uffta) {
      return res.status(404).json({ message: 'UFFTA entry not found' });
    }
    res.json(uffta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUFFTAById = async (req, res) => {
  try {
    const uffta = await UFFTA.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!uffta) {
      return res.status(404).json({ message: 'UFFTA entry not found' });
    }
    res.json(uffta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUFFTAById = async (req, res) => {
  try {
    const uffta = await UFFTA.findByIdAndDelete(req.params.id);
    if (!uffta) {
      return res.status(404).json({ message: 'UFFTA entry not found' });
    }
    res.json({ message: 'UFFTA entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
