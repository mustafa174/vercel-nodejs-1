import jwt from "jsonwebtoken";
import JwtService from "../services/jwt.service";

const userRoleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const token = JwtService.jwtGetToken(req);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized", errorCode: 401 });
    }

    jwt.verify(token, process.env.SERVER_JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Not allowed to perform this action", errorCode: 401 });
      }

      // Check if the user's role is one of the allowed roles
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "You do not have permission to perform this action", errorCode: 403 });
      }

      req.user = decoded;
      next(); // Continue to the next middleware or controller
    });
  };
};

export default userRoleMiddleware;
