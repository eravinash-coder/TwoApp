// routes/CountryRoutes.js

const express = require('express');
const router = express.Router();
const CountryController = require('../controllers/CountryController');


router.post('/countries', CountryController.addCountry);
router.get('/countries', CountryController.getAllCountries);
router.get('/countries/:id', CountryController.findCountryByIdController);
router.put('/countries/:id', CountryController.updateCountry);
router.delete('/countries/:id', CountryController.deleteCountry);


router.post('/CountryCategory/:countryId', CountryController.addCountryCategory);
router.get('/CountryCategory/', CountryController.getCountryCategory);
router.get('/CountryCategory/bycountryid/:countryId', CountryController.getAllCountryCategoryByCountryId);
router.get('/CountryCategory/:countryId/:CountryCategoryId', CountryController.findCityById); 
router.put('/CountryCategory/:countryId/:CountryCategoryId', CountryController.updateCountryCategory);
router.delete('/CountryCategory/:countryId/:CountryCategoryId', CountryController.deleteCountryCategory);





router.post('/countryData/:id/:secondId', CountryController.addcountryData);
router.get('/countryData', CountryController.getAllCountryData);
router.get('/countryData/:countryId/city/:cityId/countryData/:subcollectionId', CountryController.getCountryDataById);
router.put('/countryData/:countryId/city/:cityId/countryData/:subcollectionId', CountryController.updateCountryData);
router.delete('/countryData/:countryId/city/:cityId/countryData/:subcollectionId', CountryController.deleteCountryData);


module.exports = router;
