import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false; // Track the connection state

export const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection...");
    return; // Return if already connected
  }

  try {
    const db = process.env.MONGO_URI;

    // Mongoose connection
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true; // Mark as connected
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process if unable to connect
  }
};
