import { Router } from "express";
import cartController from "../controllers/cart.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { API_PREFIX_V1 } from "../utils/constants";

const cartRoutes = Router();

// Cart-related routes
cartRoutes.post(`/${API_PREFIX_V1}/cart/add`, authMiddleware, cartController.add);
cartRoutes.get(`/${API_PREFIX_V1}/cart`, authMiddleware, cartController.get);
cartRoutes.patch(`/${API_PREFIX_V1}/cart`, authMiddleware, cartController.update);
cartRoutes.delete(`/${API_PREFIX_V1}/cart/item`, authMiddleware, cartController.delete);

export { cartRoutes };
