import User from "../models/user.js"; // Import your User model
import AppError from "../utils/appError.js";
import bcrypt from "bcrypt"; // Import the crypto package
import jwt from "jsonwebtoken";
class UserService {
  // Method to create a new user
  async createUser(userData) {
    try {
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("This email is already registered");
      }

      // Hash the password using bcrypt with a salt
      const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 is the salt rounds (cost factor)

      // Create a new user instance with the hashed password
      const user = new User({
        ...userData,
        password: hashedPassword, // Save the bcrypt-hashed password
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
  async LoginUser(body) {
    try {
      const { email, password } = body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Incorrect password");
      }

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Authentication successful
      return {
        user: {
          id: user._id,
          email: user.email,
          // Add any other user fields you want to return
        },
        token,
      };
    } catch (error) {
      console.log("Error during login:", error.message);
      throw new Error(error.message);
    }
  }

  //
  async findAllUsers(email) {
    try {
      const user = await User.find();

      return user; // Return the found user or null
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new UserService(); // Export an instance of UserService
