// controllers/CountryController.js
const CountryModel = require('../models/CountryModel');


async function addCountry(req, res) {
    const countryData = req.body;
    await CountryModel.addCountry(countryData);
    res.send('Country added successfully');
}

async function getAllCountries(req, res) {
    const countries = await CountryModel.getAllCountries();
    res.json({
        success: true,
        data: countries
    })
}


async function findCountryByIdController(req, res) {
    const { id } = req.params;

    try {
        const country = await CountryModel.findCountryById(id);
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        res.json({
            success: true,
            data: country
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateCountry(req, res) {
    const countryId = req.params.id;
    const newData = req.body.NewsCat.NewsCatData;
    await CountryModel.updateCountry(countryId, newData);
    res.send('Country updated successfully');
}

async function deleteCountry(req, res) {
    const countryId = req.params.id;
    await CountryModel.deleteCountry(countryId);
    res.json({
        success: true,
        msg: 'Successfully Deleted'
    })
}

async function addCountryCategory(req, res) {
    const countryId  = req.params.countryId;
    const cityData  = req.body;
    const result = await CountryModel.addCountryCategory(countryId, cityData);
    res.json(result);
}
async function getAllCountryCategoryByCountryId(req, res) {
    const countryId  = req.params.countryId;
    const cityData = await CountryModel.getAllCountryCategoryByCountryId(countryId);
    if (cityData) {
        res.json({
            success: true,
            data: cityData
        })
    } else {
        res.status(404).json({ message: 'City not found' });
    }
}

async function getCountryCategory(req, res) {
    
    const cityData = await CountryModel.getAllCountryCategory();
    if (cityData) {
        res.json({
            success: true,
            data: cityData
        })
    } else {
        res.status(404).json({ message: 'City not found' });
    }
}

async function findCityById(req, res) {
    const { countryId, CountryCategoryId } = req.params;
    const result = await CountryModel.findById(countryId, CountryCategoryId);
    if (result) {
        res.json({
            success: true,
            data: result
        })
    } else {
        res.status(404).json({ message: result.message });
    }
}

async function updateCountryCategory(req, res) {
    const { countryId, CountryCategoryId } = req.params;
    const newData = req.body.NewsCat;
    console.log(newData);
    const result = await CountryModel.updateCountryCategory(countryId, CountryCategoryId, newData);
    res.json(result);
}

async function deleteCountryCategory(req, res) {
    const { countryId, CountryCategoryId } = req.params;
    const result = await CountryModel.deleteCountryCategory(countryId, CountryCategoryId);
    res.json(result);
}


async function addcountryData(req, res) {
    const countryId = req.params.id;
    const cityId = req.params.secondId;
    console.log(cityId);
    await CountryModel.addCountryData(countryId,cityId,req.body);
    res.send('Country deleted successfully');
}

async function getAllCountryData(req, res) {
    const countryData = await CountryModel.getAllCountryData();
    res.json({
        success: true,
        data: countryData
    })
}

async function getCountryDataById(req, res) {
    const { countryId, cityId, subcollectionId } = req.params;
    const result = await CountryModel.getCountryDataById(countryId, cityId, subcollectionId);
    if (result) {
        res.json({
            success: true,
            data: result
        })
    } else {
        res.status(404).json({ message: result.message });
    }
}

async function updateCountryData(req, res) {
    const { countryId, cityId, subcollectionId } = req.params;
    const newData = req.body.NewsCatData;
    const result = await CountryModel.updateCountryData(countryId, cityId, subcollectionId, newData);
    res.json(result);
}

async function deleteCountryData(req, res) {
    const { countryId, cityId, subcollectionId } = req.params;
    const result = await CountryModel.deleteCountryData(countryId, cityId, subcollectionId);
    res.json(result);
}

module.exports = {
    addCountry,
    getAllCountries,
    findCountryByIdController,
    updateCountry,
    deleteCountry,


    addCountryCategory,
    getCountryCategory,
    findCityById,
    getAllCountryCategoryByCountryId,
    updateCountryCategory,
    deleteCountryCategory,
    
    addcountryData,
    getAllCountryData,
    getCountryDataById,
    updateCountryData,
    deleteCountryData
};
