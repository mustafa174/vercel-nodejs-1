import { v2 as cloudinary } from "cloudinary";
//

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Your API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your API secret
  secure: true,
});

export const uploadToCloudinary = async (filePath, folderName = "user_images") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName, // Optional: Specify a folder in Cloudinary
      use_filename: true, // Use the file name in the upload
      unique_filename: false, // Prevent generating unique filenames
    });

    return result; // Return the upload result, which includes the URL and other metadata
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error; // Rethrow the error for handling in your route or controller
  }
};
