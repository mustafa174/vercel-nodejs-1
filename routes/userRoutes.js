import { Router } from "express";
const router = Router();
import userService from "../services/userService.js"; // Import user service
import { validateRequest } from "../middlewares/validateRequest.js";
import { registerUserSchema } from "../validators/userValidators.js";
import successResponse from "../utils/successResponse.js";
import AppError from "../utils/appError.js";
// Route to register a new user
router.post("/register", validateRequest(registerUserSchema), async (req, res, next) => {
  try {
    const userData = req.body;
    console.log("HITINGGGG");
    const userResponse = await userService.createUser(userData); // Use userService to create a user
    successResponse(res, userResponse, "User created succesfully!");
  } catch (error) {
    console.log("error >>>>", error);
    next(error);
  }
});

// Route to log in a user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);

    successResponse(res, message, "User logged in successfully");
  } catch (error) {
    next({
      message: error.message,
    });
  }
});

// fetch all users

router.get("/allusers", async (req, res, next) => {
  try {
    const userResponse = await userService.findAllUsers(); // Use userService to create a user
    successResponse(res, userResponse, "User created succesfully!");
  } catch (error) {
    next({
      message: error.message,
    });
  }
});

// Route to update user profile
router.put("/profile/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUser(userId, req.body);

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    next({
      message: error.message,
    });
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const userId = req.query.id;
    console.log("RECEIVED>", userId);

    // Call the deleteUser function
    const deletedUser = await userService.deleteUser(userId);

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.log("error>", error);
    next({
      message: error.message,
    });
  }
});

export default router;
