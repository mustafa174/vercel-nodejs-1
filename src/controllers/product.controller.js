// controllers/productController.js
import { BadRequestError, UnauthorizedError, ValidationError, sendSuccessResponse } from "../utils/ApiError";
import Product from "../models/Products"; // Assuming your Product model is here

const productController = {
  add: async (req, res, next) => {
    try {
      const { name, price, description, image, status, rating, availability } = req.body;

      // Validation
      if (!name || !price) {
        throw new ValidationError("Product name and price are required");
      }

      // Add the product to the database
      const newProduct = await Product.create({
        name,
        price,
        description,
        image,
        status,
        rating,
        availability,
      });

      sendSuccessResponse(res, newProduct, "Product added successfully!");
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  },

  list: async (req, res, next) => {
    try {
      const products = await Product.findAll(); // Get all products
      sendSuccessResponse(res, products, "Products retrieved successfully!");
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  },

  listSingle: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if the product exists
      const product = await Product.findByPk(id);
      if (!product) {
        throw new BadRequestError("Product not found");
      }

      sendSuccessResponse(res, product, "Product retrieved successfully!");
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  },

  patch: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, price, description, image, status, rating, availability } = req.body;

      // Check if the product exists
      const product = await Product.findByPk(id);
      if (!product) {
        throw new BadRequestError("Product not found");
      }

      // Validate required fields
      if (!name || !price) {
        throw new ValidationError("Product name and price are required");
      }

      // Update the product
      const updatedProduct = await product.update({
        name,
        price,
        description,
        image,
        status,
        rating,
        availability,
      });

      sendSuccessResponse(res, updatedProduct, "Product updated successfully!");
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  },

  remove: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if the product exists
      const product = await Product.findByPk(id);
      if (!product) {
        throw new BadRequestError("Product not found");
      }

      // Remove the product
      await product.destroy();

      sendSuccessResponse(res, null, "Product removed successfully!");
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  },
};

export default productController;
