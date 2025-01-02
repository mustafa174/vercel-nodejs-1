// src/index.js
import dotenv from "dotenv";
import expressService from "./services/express.service";

import sequelizeService from "./services/sequelize.service";

import cloudinaryService from "./services/cloudinary.service";
dotenv.config();

// Create the express app
const createApp = async () => {
  const app = await expressService.init();
  return app;
};

// Export a Vercel serverless function handler
export default async function (req, res) {
  // Initialize services (sequelize, cloudinary, and express)
  await sequelizeService.init();
  await cloudinaryService.init();

  // Initialize the express app
  const app = await createApp();
  app(req, res); // Pass the request and response to the app
}
