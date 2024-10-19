import User from "../models/user.js"; // Import your User model
import AppError from "../utils/appError.js";
import crypto from "crypto"; // Import the crypto package

class UserService {
  // Method to create a new user
  async createUser(userData) {
    try {
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("This email is already registered");
      }

      // Hash the password
      const hashedPassword = crypto
        .createHash("sha256") // You can use "sha256" or other algorithms
        .update(userData.password) // Add the password to be hashed
        .digest("hex"); // Get the hashed output in hexadecimal format

      // Create a new user instance with the hashed password
      const user = new User({
        ...userData,
        password: hashedPassword, // Save the hashed password
      });

      await user.save();
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Method to find a user by ID
  async findUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user; // Return the found user
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Method to update a user's profile
  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the schema
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user; // Return the updated user
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Method to delete a user
  async deleteUser(userId) {
    try {
      // Check if userId is a valid ObjectId

      // Use the correct method with the ObjectId
      const user = await User.findByIdAndDelete(userId); // Pass the userId directly

      if (!user) {
        throw new Error("User not found");
      }

      return user; // Return the deleted user
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Method to find a user by email
  async findUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user; // Return the found user or null
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findAllUsers(email) {
    try {
      const user = await User.find();
      console.log(">>> hit inside", user);
      return user; // Return the found user or null
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new UserService(); // Export an instance of UserService
