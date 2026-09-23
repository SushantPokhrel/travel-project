const cloudinary = require("cloudinary").v2;
const multer = require("multer");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
const storage = multer.memoryStorage(); // in memory files storage temporarily
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});
module.exports = { upload, cloudinary };
//Multer stores incoming file stream in a memory chunk called buffer
// buffer is a memory container containing raw streams of file data
