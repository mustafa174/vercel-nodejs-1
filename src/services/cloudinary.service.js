import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary config
const cloudinaryService = {
  init: () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("[CLOUDINARY] Cloudinary service initialized");
  },

  // Upload image function
  uploadImage: async (filePath, options = {}) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: options.folder || "uploads",
        ...options,
      });
      console.log(`[CLOUDINARY] Image uploaded to ${result.secure_url}`);
      return result.secure_url;
    } catch (error) {
      console.error("[CLOUDINARY] Error uploading image:", error);
      throw new Error("Image upload failed");
    }
  },
};

export default cloudinaryService;
