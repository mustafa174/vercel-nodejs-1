import { BadRequestError, sendSuccessResponse, ValidationError } from "../utils/ApiError";
import ProductReview from "../models/productReview";
import Product from "../models/Products";
import User from "../models/User"; // Assuming you have a User model

let productReviewController = {
  // Add a review for a product
  addReview: async (req, res, next) => {
    try {
      const { productId, rating, comment, userId } = req.body;

      // Check if the user exists in the database
      const user = await User.findByPk(userId);
      if (!user) {
        throw new ValidationError("User not found.");
      }

      // Validation for required fields
      if (!productId || !rating) {
        throw new ValidationError("Product ID and rating are required.");
      }

      // Optional: Validate rating range
      if (rating < 1 || rating > 5) {
        throw new ValidationError("Rating must be between 1 and 5.");
      }

      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new ValidationError("Product not found.");
      }

      // Check if the user has already reviewed this product
      const existingReview = await ProductReview.findOne({
        where: { productId, userId },
      });
      if (existingReview) {
        throw new ValidationError("You have already reviewed this product.");
      }

      // Create the product review
      const review = await ProductReview.create({
        userId,
        productId,
        rating,
        comment,
      });

      sendSuccessResponse(res, review, "Review added successfully!");
    } catch (error) {
      next(error);
    }
  },

  // Remove a review from a product
  removeReview: async (req, res, next) => {
    try {
      const { reviewId } = req.body;
      const userId = req.userId;

      // Validation for required fields
      if (!reviewId) {
        throw new ValidationError("Review ID is required.");
      }

      // Find the review by ID
      const review = await ProductReview.findOne({
        where: { id: reviewId, userId },
      });

      if (!review) {
        throw new ValidationError("Review not found or you do not have permission to delete this review.");
      }

      // Delete the review
      await review.destroy();

      sendSuccessResponse(res, null, "Review deleted successfully!");
    } catch (error) {
      next(error);
    }
  },

  // Get all reviews for a product
  getReviews: async (req, res, next) => {
    try {
      const { productId } = req.params;

      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new ValidationError("Product not found.");
      }

      // Fetch all reviews for the product
      const reviews = await ProductReview.findAll({
        where: { productId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "avatar"], // Include user details
          },
        ],
      });

      sendSuccessResponse(res, reviews, "Reviews fetched successfully!");
    } catch (error) {
      next(error);
    }
  },

  // Get all reviews across all products for admin
  getAllReviewsForAdmin: async (req, res, next) => {
    try {
      // Fetch all reviews from the ProductReview table
      const reviews = await ProductReview.findAll({
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name"], // Include product details
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "avatar"], // Include user details
          },
        ],
        order: [["createdAt", "DESC"]], // Optional: Sort reviews by creation date
      });

      // Send response
      sendSuccessResponse(res, reviews, "All reviews fetched successfully!");
    } catch (error) {
      next(error);
    }
  },
};

export default productReviewController;
