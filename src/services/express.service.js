// src/services/express.service.js
import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors";

// Automatically load routes
const routeFiles = fs.readdirSync(__dirname + "/../routes/").filter((file) => file.endsWith(".js"));

let routes = [];

const expressService = {
  init: async () => {
    try {
      // Create an Express app
      const app = express();

      // Loading routes dynamically
      for (const file of routeFiles) {
        const route = await import(`../routes/${file}`);
        const routeName = Object.keys(route)[0];
        routes.push(route[routeName]);
      }

      // Apply middleware
      app.use(cors());
      app.use(express.json()); // Middleware for JSON requests
      app.use(bodyParser.urlencoded({ extended: true })); // For form data
      app.use(routes);

      // Return the app so that it can be used in a handler
      return app;
    } catch (error) {
      console.log("[EXPRESS] Error during express service initialization");
      throw error;
    }
  },
};

// Export the initialization function for use in a serverless handler
export default expressService;
