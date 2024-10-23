import jwt from "jsonwebtoken";
import UserToken from "../models/auth.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Check if the token exists in the database
    const storedToken = await UserToken.findOne({ token });

    if (!storedToken) {
      return res.status(401).json({ message: "Token not found or expired" });
    }

    // Verify the token using JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return res.status(403).json({ message: "Failed to authenticate token" });
      }

      // If the token is valid, attach user data to request
      req.userId = decoded.id; // Store user ID from the decoded token for use in future routes
      next(); // Move to the next middleware or route handler
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
