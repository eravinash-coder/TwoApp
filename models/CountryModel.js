// models/CountryModel.js
const admin = require('../utils/firebase');


const db = admin.firestore();

async function addCountry(countryData) {
    try {
        await db.collection('country').doc(countryData.id).set(countryData);
        console.log('Country added successfully');
    } catch (error) {
        console.error('Error adding country: ', error);
    }
}

async function getAllCountries() {
    try {
        const countriesSnapshot = await db.collection('country').get();
        const allCountries = [];

        countriesSnapshot.forEach(countryDoc => {
            allCountries.push({
                id: countryDoc.id,
                data: countryDoc.data()
            });
        });

        return allCountries;
    } catch (error) {
        console.error('Error getting all countries: ', error);
        return [];
    }
}

async function findCountryById(countryId) {
    try {
        const countryDoc = await db.collection('country').doc(countryId).get();

        if (!countryDoc.exists) {
            console.error('Country not found');
            return [];
        }

        return countryDoc.data(); // Return as an array containing a single object
    } catch (error) {
        console.error('Error finding country by ID: ', error);
        return [];
    }
}


async function updateCountry(countryId, newData) {
    try {
        await db.collection('country').doc(countryId).update(newData);
        console.log('Country updated successfully');
    } catch (error) {
        console.error('Error updating country: ', error);
    }
}

async function deleteCountry(countryId) {
    try {
        // Delete all documents in the subcollection
        const cityDocs = await db.collection('country').doc(countryId).collection('countryCategory').get();
        const deletePromises = [];
        cityDocs.forEach(doc => {
            deletePromises.push(doc.ref.delete());
        });
        await Promise.all(deletePromises);

        // Now delete the country document
        await db.collection('country').doc(countryId).delete();

        console.log('Country and its subcollection deleted successfully');
    } catch (error) {
        console.error('Error deleting country and subcollection: ', error);
    }
}



async function addCountryCategory(countryId, cityData) {
    try {
        const countryRef = db.collection('country').doc(countryId);

        // Reference the city document with the specified ID
        const cityRef = countryRef.collection('countryCategory').doc(cityData.id);

        // Set the city data with the specified ID
        await cityRef.set(cityData);
        return { success: true, message: 'City updated successfully' };
    } catch (error) {
        console.error('Error adding city to country: ', error);
    }
}
async function getAllCountryCategoryByCountryId(countryId) {
    try {
        const countryRef = db.collection('country').doc(countryId);
        const countrySnapshot = await countryRef.get();

        if (!countrySnapshot.exists) {
            throw new Error('Country not found');
        }

        const citySnapshot = await countryRef.collection('countryCategory').get();

        const allCountryCategories = [];

        citySnapshot.forEach(cityDoc => {
            allCountryCategories.push({
                countryId,
                cityId: cityDoc.id,
                data: cityDoc.data()
            });
        });

        return allCountryCategories;
    } catch (error) {
        console.error('Error getting country categories: ', error);
        return [];
    }
}


async function getAllCountryCategory() {
    try {
        const countrySnapshot = await db.collection('country').get();
        const allCountryCategories = [];

        for (const countryDoc of countrySnapshot.docs) {
            const countryId = countryDoc.id;
            const countryData = countryDoc.data(); // Accessing document data correctly
            const countryName = countryData.countryName; // Correct way to access countryName
            const citySnapshot = await countryDoc.ref.collection('countryCategory').get();

            citySnapshot.forEach(cityDoc => {
                allCountryCategories.push({
                    countryId,
                    countryName,
                    cityId: cityDoc.id,
                    data: cityDoc.data()
                });
            });
        }

        return allCountryCategories;
    } catch (error) {
        console.error('Error getting all country categories: ', error);
        return [];
    }
}



async function findById(countryId, cityId) {
    try {
        const countryRef = db.collection('country').doc(countryId);
        const cityDoc = await countryRef.collection('countryCategory').doc(cityId).get();
        if (cityDoc.exists) {
            return cityDoc.data();
        } else {
            return { success: false, message: 'City not found' };
        }
    } catch (error) {
        console.error('Error finding city by ID:', error);
        return { success: false, message: 'Failed to find city' };
    }
}

async function updateCountryCategory(countryId, cityId, newData) {
    try {
        const countryRef = db.collection('country').doc(countryId);
        const cityRef = countryRef.collection('countryCategory').doc(cityId);
        await cityRef.update(newData);
        return { success: true, message: 'City updated successfully' };
    } catch (error) {
        console.error('Error updating city:', error);
        return { success: false, message: 'Failed to update city' };
    }
}

async function deleteCountryCategory(countryId, cityId) {
    try {
        const countryRef = db.collection('country').doc(countryId);
        const cityRef = countryRef.collection('countryCategory').doc(cityId);

        // Delete all documents in the subcollection
        const subcollectionSnapshot = await cityRef.collection('countryData').get();
        const deletePromises = [];
        subcollectionSnapshot.forEach(doc => {
            deletePromises.push(doc.ref.delete());
        });
        await Promise.all(deletePromises);

        // Now delete the city document itself
        await cityRef.delete();

        return { success: true, message: 'City and its subcollection deleted successfully' };
    } catch (error) {
        console.error('Error deleting city:', error);
        return { success: false, message: 'Failed to delete city and its subcollection' };
    }
}


async function addCountryData(countryId, cityId, subcollectionData) {
    try {
        const countryRef = db.collection('country').doc(countryId);
        const cityRef = countryRef.collection('countryCategory').doc(cityId);
        const subcollectionRef = cityRef.collection('countryData').doc(subcollectionData.id);

        await subcollectionRef.set(subcollectionData);

        return { success: true, message: 'Subcollection added successfully' };
    } catch (error) {
        console.error('Error adding subcollection to city: ', error);
        return { success: false, message: 'Failed to add subcollection to city' };
    }
}

async function getAllCountryData() {
    try {
        const countrySnapshot = await db.collection('country').get();
        const countryData = [];

        for (const countryDoc of countrySnapshot.docs) {
            const countryId = countryDoc.id;
            const countryDataa = countryDoc.data(); // Accessing document data correctly
            const countryName = countryDataa.countryName; // Correct way to access countryName
            const citySnapshot = await countryDoc.ref.collection('countryCategory').get();

            for (const cityDoc of citySnapshot.docs) {
                const cityId = cityDoc.id;
                const countryDataa = cityDoc.data(); // Accessing document data correctly
                const categoryName = countryDataa.categoryName; // Correct way to access countryName
                
                const countryDataSnapshot = await cityDoc.ref.collection('countryData').get();

                countryDataSnapshot.forEach(subcollectionDoc => {
                    countryData.push({
                        countryName,
                        categoryName,
                        countryId,
                        cityId,
                        subcollectionId: subcollectionDoc.id,
                        data: subcollectionDoc.data()
                    });
                });
            }
        }
        
        return countryData;
    } catch (error) {
        console.error('Error getting all country data: ', error);
        return [];
    }
}

async function getCountryDataById(countryId, cityId, subcollectionId) {
    try {
        const subcollectionDoc = await db.collection('country').doc(countryId)
            .collection('countryCategory').doc(cityId)
            .collection('countryData').doc(subcollectionId).get();

        if (subcollectionDoc.exists) {
            return subcollectionDoc.data();
        } else {
            return { success: false, message: 'Subcollection data not found' };
        }
    } catch (error) {
        console.error('Error getting subcollection data: ', error);
        return { success: false, message: 'Failed to get subcollection data' };
    }
}

async function updateCountryData(countryId, cityId, subcollectionId, newData) {
    try {
        await db.collection('country').doc(countryId)
            .collection('countryCategory').doc(cityId)
            .collection('countryData').doc(subcollectionId).update(newData);

        return { success: true, message: 'Subcollection data updated successfully' };
    } catch (error) {
        console.error('Error updating subcollection data: ', error);
        return { success: false, message: 'Failed to update subcollection data' };
    }
}

async function deleteCountryData(countryId, cityId, subcollectionId) {
    try {
        await db.collection('country').doc(countryId)
            .collection('countryCategory').doc(cityId)
            .collection('countryData').doc(subcollectionId).delete();

        return { success: true, message: 'Subcollection data deleted successfully' };
    } catch (error) {
        console.error('Error deleting subcollection data: ', error);
        return { success: false, message: 'Failed to delete subcollection data' };
    }
}

module.exports = {
    addCountry,
    getAllCountries,
    findCountryById,
    updateCountry,
    deleteCountry,

    addCountryCategory,
    getAllCountryCategory,
    updateCountryCategory,
    deleteCountryCategory,
    getAllCountryCategoryByCountryId,
    findById,

    addCountryData,
    getCountryDataById,
    updateCountryData,
    deleteCountryData,
    getAllCountryData
};
