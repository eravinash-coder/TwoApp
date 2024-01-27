const cloudinary = require("cloudinary").v2;
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadFile = async(filePath) => {

    try {
        console.log(filePath);
        const result = await cloudinary.uploader.upload(filePath);
        console.log('Cloudinary Upload Result:', result);
        return result;
    } catch (error) {
        
    
    }

}

module.exports = {
    uploadFile
}