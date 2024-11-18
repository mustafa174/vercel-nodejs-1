import { Router } from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import userRoleMiddleware from "../middlewares/userRole.middleware";
import { API_PREFIX_V1 } from "../utils/constants";

const userRoutes = Router();

userRoutes.post(`/${API_PREFIX_V1}/user/address`, authMiddleware, userController.addAddress);
userRoutes.get(`/${API_PREFIX_V1}/all-users`, authMiddleware, userController.get);
userRoutes.get(`/${API_PREFIX_V1}/user/:id`, authMiddleware, userController.find);
userRoutes.put(`/${API_PREFIX_V1}/user/update`, authMiddleware, userController.update);
userRoutes.delete(`/${API_PREFIX_V1}/user/:id`, authMiddleware, userController.delete);

// Authentication routes

userRoutes.post(`/${API_PREFIX_V1}/user/login`, userController.login);
userRoutes.get(`/${API_PREFIX_V1}/user/logout`, authMiddleware, userController.logout);
userRoutes.post(`/${API_PREFIX_V1}/user/register`, userController.add);
export { userRoutes };
