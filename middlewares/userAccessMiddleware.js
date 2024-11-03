import jwt from "jsonwebtoken";

export const userRoleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized", errorCode: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Unauthorized", errorCode: 401 }); // Token is invalid or expired
      }

      // Check if the user's role is one of the allowed roles
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "You do not have permission to perform this action", errorCode: 403 });
      }

      req.user = decoded; // Attach user information to the request if needed
      next(); // Proceed to the next middleware or route handler
    });
  };
};
