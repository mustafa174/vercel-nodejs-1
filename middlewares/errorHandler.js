// errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Set default values
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || "Something went wrong!";
  const message = err.message || "An unexpected error occurred";

  // Set the Content-Type header to application/json
  res.setHeader("Content-Type", "application/json");

  // Return a JSON response
  res.status(statusCode).json({
    isSuccess: false,
    errorCode: errorCode,
    message: message,
  });
};

export default errorHandler;
