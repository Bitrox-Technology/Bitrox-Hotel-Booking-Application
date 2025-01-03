import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
// 'fs' is file system that help to read write on the file. mainly we need a file path.

// In our file system our file are linked or unlinked
// Linked means attached and Unlinked means delete the files


const uploadOnCloudinary = async (localFilePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  try {
    if (!localFilePath) return null;
    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
}

const uploadMutliImageOnCloudinary = async(localFilePath, options = {}) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    if (!localFilePath) return null;
    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      ...options
    })
    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      console.error("Error uploading to Cloudinary:", error.message);
      try {
        fs.unlinkSync(localFilePath);
      } catch (unlinkError) {
        console.error("Error removing local file:", unlinkError.message);
      }
    }
    return null
  }
}

export { 
  uploadOnCloudinary, 
  uploadMutliImageOnCloudinary 
}