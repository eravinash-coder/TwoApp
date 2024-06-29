const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function handleUploadpdf(file) {
  const res = await cloudinary.uploader.upload_stream({
    resource_type: "auto",
  }, (error, result) => {
    if (error) {
      throw new Error(error.message);
    }
    return result.secure_url;
  }).end(file.buffer);

  return res.secure_url;
}

module.exports = handleUploadpdf;
