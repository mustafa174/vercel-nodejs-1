import express from "express";
import ProductController from "../controllers/product.controller";
import { API_PREFIX_V1 } from "../utils/constants";
import multer from "multer";

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" }); // Temporary storage directory

const router = express.Router();

router.post(
  `/${API_PREFIX_V1}/product/add`,
  upload.single("file"), // Hanremovedle single file upload with field name 'file'
  (req, res, next) => {
    const productData = {
      ...req.body,
      file: req.file, // Add file data to the request body for further processing
    };
    // Continue with the product addition logic
    // ProductController.add(req, res, next);
    ProductController.add(productData, res, next); // Pass the product data to the controller
  }
);

router.delete(`/${API_PREFIX_V1}/product/remove/:id`, ProductController.remove);
// router.patch(`/${API_PREFIX_V1}/product/update/:id`, ProductController.patch);

//
router.patch(
  `/${API_PREFIX_V1}/product/update/:id`,
  upload.single("file"), // Hanremovedle single file upload with field name 'file'
  (req, res, next) => {
    const productData = {
      ...req.body,
      file: req.file, // Add file data to the request body for further processing
      id: req.params.id,
    };

    ProductController.patch(productData, res, next); // Pass the product data to the controller
  }
);
router.get(`/${API_PREFIX_V1}/product/list`, ProductController.list);
router.get(`/${API_PREFIX_V1}/product/:id`, ProductController.listSingle);

export default router;
