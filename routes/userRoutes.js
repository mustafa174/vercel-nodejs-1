import { Router } from "express";
const router = Router();
import userService from "../services/userService.js"; // Import user service
import { validateRequest } from "../middlewares/validateRequest.js";
import { authMiddlewareProtectedApis } from "../middlewares/auth.js";
import { registerUserSchema, loginSchema } from "../validators/userValidators.js";
import successResponse from "../utils/successResponse.js";

import { userRoleMiddleware } from "../middlewares/userAccessMiddleware.js";
import { allowedRoles } from "../utils/constants.js";

// Route to register a new user

// allowed roles

router.post("/register", validateRequest(registerUserSchema), async (req, res, next) => {
  try {
    const userData = req.body;

    const userResponse = await userService.createUser(userData); // Use userService to create a user
    successResponse(res, userResponse, "User created succesfully!");
  } catch (error) {
    console.log("error >>>>", error);
    next(error);
  }
});

// Route to log in a user
router.post("/login", validateRequest(loginSchema), async (req, res, next) => {
  try {
    const user = await userService.LoginUser(req.body);

    successResponse(res, user, "User logged in successfully");
  } catch (error) {
    next({
      message: error.message,
    });
  }
});

// fetch all users

router.get("/allusers", authMiddlewareProtectedApis, async (req, res, next) => {
  try {
    const userResponse = await userService.findAllUsers(); // Use userService to create a user
    successResponse(res, userResponse, "success");
  } catch (error) {
    next({
      message: error.message,
    });
  }
});

router.get("/get-single-user", authMiddlewareProtectedApis, async (req, res, next) => {
  try {
    const userId = req.query.id;

    const userResponse = await userService.findUserById(userId);

    successResponse(res, userResponse, "success");
  } catch (error) {
    next({
      message: error.message,
    });
  }
});

// Route to update user profile
router.put("/update-profile/:id", authMiddlewareProtectedApis, async (req, res, next) => {
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

router.delete("/delete-user", authMiddlewareProtectedApis, userRoleMiddleware(allowedRoles), async (req, res, next) => {
  try {
    const userId = req.query.id;

    res.json({ message: "User deleted successfully", user: userId });
    return;
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
