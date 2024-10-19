import Joi from "joi";

// Validation middleware function
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // Validate the request body
    if (error) {
      return res.status(400).json({ message: error.details[0].message }); // Send error if validation fails
    }
    next(); // Proceed to the next middleware or route handler
  };
};
