import productReview from "../controllers/productReview.controller";
import { API_PREFIX_V1 } from "../utils/constants";
import { Router } from "express";

const router = Router();

// Define the API_PREFIX_V1 (for example, "v1")

// Add a review for a product
router.post(`/${API_PREFIX_V1}/reviews/add`, productReview.addReview);

// Remove a review from a product
router.delete(`/${API_PREFIX_V1}/reviews`, productReview.removeReview);

// Get all reviews for a product
router.get(`/${API_PREFIX_V1}/reviews/product/:productId`, productReview.getReviews);

// Get all reviews across all products (admin only)
router.get(`/${API_PREFIX_V1}/reviews/all`, productReview.getAllReviewsForAdmin);

export { router };
