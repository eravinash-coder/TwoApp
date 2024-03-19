// insurenceController.js
const Insurence = require('../models/insurence');

// Create a new insurance
exports.createInsurance = async (req, res) => {
    try {
        const insurance = await Insurence.create(req.body);
        res.status(201).json({ status: 'success', data: insurance });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Get all insurances
exports.getAllInsurances = async (req, res) => {
    try {
        const insurances = await Insurence.find();
        res.status(200).json({ status: 'success', data: insurances });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Get an insurance by ID
exports.getInsurance = async (req, res) => {
    try {
        const insurance = await Insurence.findById(req.params.id);
        if (!insurance) {
            return res.status(404).json({ status: 'fail', message: 'Insurance not found' });
        }
        res.status(200).json({ status: 'success', data: insurance });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Update an insurance by ID
exports.updateInsurance = async (req, res) => {
    try {
        const insurance = await Insurence.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!insurance) {
            return res.status(404).json({ status: 'fail', message: 'Insurance not found' });
        }
        res.status(200).json({ status: 'success', data: insurance });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Delete an insurance by ID
exports.deleteInsurance = async (req, res) => {
    try {
        const insurance = await Insurence.findByIdAndDelete(req.params.id);
        if (!insurance) {
            return res.status(404).json({ status: 'fail', message: 'Insurance not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
