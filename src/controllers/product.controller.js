// controllers/productController.js
import { BadRequestError, UnauthorizedError, ValidationError, sendSuccessResponse } from "../utils/ApiError";
import * as Yup from "yup";
import cloudinaryService from "../services/cloudinary.service";
import Product from "../models/Products"; // Assuming your Product model is here
import { Op } from "sequelize";

const productController = {
  add: async (req, res, next) => {
    try {
      const body = req;

      // Define Yup validation schema
      const schema = Yup.object().shape({
        name: Yup.string().required("Product name is required"),
        price: Yup.number().required("Product price is required").positive(),
        description: Yup.string().nullable(),
        status: Yup.string().nullable(),
        rating: Yup.number().nullable().min(0).max(5),
        availability: Yup.boolean().nullable(),
        category: Yup.string().required("Category is required"),
        target_audience: Yup.string().oneOf(["men", "women", "unisex"]).required("For field is required"),
        badge: Yup.boolean().nullable(),
        color: Yup.string().required("color is required"),
      });
      // Validate request body
      // Validate request body with Yup
      try {
        await schema.validate(body, { abortEarly: false }); // abortEarly: false to return all validation errors
      } catch (err) {
        // Return specific validation errors
        const validationErrors = err.inner.reduce((acc, error) => {
          acc[error.path] = error.message; // Map field name to error message
          return acc;
        }, {});

        // Return a response with validation errors
        return res.status(400).json({
          message: "Validation failed",
          errors: validationErrors,
        });
      }
      // Extract fields from the request
      const { name, price, description, status, rating, availability, category, target_audience, badge, color } = body;
      const file = body.file;
      console.log("imageUr > ***>>>l", body);

      let imageUrl = null;
      if (file) {
        // Upload image to Cloudinary
        imageUrl = await cloudinaryService.uploadImage(file.path, { folder: "products" });
      }
      // console.log("imageUrl", imageUrl);
      // Add the product to the database
      const newProduct = await Product.create({
        name,
        price,
        description,
        image: imageUrl,
        status,
        rating,
        availability,
        category,
        badge,
        color,
        target_audience,
      });

      sendSuccessResponse(res, newProduct, "Product added successfully!");
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  },

  list: async (req, res, next) => {
    try {
      // Extract filter parameters from query
      const { name, price, description, status, rating, availability, category, target_audience } = req.query;

      // Construct the filter object for Sequelize query
      const filters = {};

      // Filter by name (case-insensitive partial match)
      if (name) {
        filters.name = {
          [Op.iLike]: `%${name}%`, // Case-insensitive search for name
        };
      }

      // Filter by price (exact match)
      if (price) {
        const priceValue = parseFloat(price);
        if (!isNaN(priceValue)) {
          filters.price = priceValue; // Exact match for price
        }
      }

      // Filter by description (exact match)
      if (description) {
        filters.description = description; // Exact match for description
      }

      // Filter by status (exact match)
      if (status) {
        filters.status = status; // Exact match for status
      }

      // Filter by rating (exact match)
      if (rating) {
        const ratingValue = parseInt(rating, 10);
        if (!isNaN(ratingValue)) {
          filters.rating = ratingValue; // Exact match for rating
        }
      }

      // Filter by availability (boolean)
      if (availability !== undefined) {
        filters.availability = availability === "true"; // Convert availability to boolean
      }

      if (category) {
        filters.category = category;
      }
      if (target_audience) {
        filters.for = target_audience;
      }
      // Query the database for products with applied filters
      const products = await Product.findAll({
        where: filters, // Apply filters dynamically
      });

      // Send the response with the filtered products
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
      const body = req;
      const { id } = body;
      console.log("BODY", body);
      // Define Yup validation schema
      const schema = Yup.object().shape({
        name: Yup.string().required("Product name is required"),
        price: Yup.number().required("Product price is required").positive(),
        description: Yup.string().nullable(),
        status: Yup.string().nullable(),
        rating: Yup.number().nullable().min(0).max(5),
        availability: Yup.boolean().nullable(),
        category: Yup.string().required("Category is required"),
        target_audience: Yup.string().oneOf(["men", "women", "unisex"]).required("For field is required"),
        badge: Yup.boolean().nullable(),
        color: Yup.string().required("color is required"),
      });

      // Validate request body

      // Validate the request body
      if (!(await schema.validate(body, { abortEarly: false }))) throw new ValidationError();

      // Extract fields from the request
      const { name, price, description, status, rating, availability, category, target_audience, badge, color } = body;
      const file = body.file; // Image file uploaded through multer

      const product = await Product.findByPk(id);
      if (!product) {
        throw new BadRequestError("Product not found");
      }

      // Check for uploaded file (image)
      let imageUrl = product.image; // Default to existing image if no new image is uploaded
      if (file) {
        // Upload the new image to Cloudinary (or other cloud service)
        imageUrl = await cloudinaryService.uploadImage(file.path, { folder: "products" });
        console.log("Uploaded Image URL:", imageUrl);
      }

      // Update the product with new or existing image
      const updatedProduct = await product.update({
        name,
        price,
        description,
        image: imageUrl,
        status,
        rating,
        availability,
        category,
        target_audience,
        badge,
        color,
      });

      // Send success response
      sendSuccessResponse(res, updatedProduct, "Product updated successfully!");
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  },

  // patch: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;
  //     const { name, price, description, image, status, rating, availability } = req.body;

  //     // Check if the product exists
  //     const product = await Product.findByPk(id);
  //     if (!product) {
  //       throw new BadRequestError("Product not found");
  //     }

  //     // Validate required fields
  //     if (!name || !price) {
  //       throw new ValidationError("Product name and price are required");
  //     }

  //     // Update the product
  //     const updatedProduct = await product.update({
  //       name,
  //       price,
  //       description,
  //       image,
  //       status,
  //       rating,
  //       availability,
  //     });

  //     sendSuccessResponse(res, updatedProduct, "Product updated successfully!");
  //   } catch (error) {
  //     next(error); // Pass error to the global error handler
  //   }
  // },

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
