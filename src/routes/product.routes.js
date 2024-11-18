import express from "express";
import ProductController from "../controllers/product.controller";
import { API_PREFIX_V1 } from "../utils/constants";

const router = express.Router();

// Define routes with the API prefix
router.post(`/${API_PREFIX_V1}/product/add`, ProductController.add);
router.delete(`/${API_PREFIX_V1}/product/remove/:id`, ProductController.remove);
router.patch(`/${API_PREFIX_V1}/product/update/:id`, ProductController.patch);
router.get(`/${API_PREFIX_V1}/product/list`, ProductController.list);
router.get(`/${API_PREFIX_V1}/product/:id`, ProductController.listSingle);

export default router;
