// utils/successResponse.js

const successResponse = (res, result, message = "Success") => {
  res.status(200).json({
    isSuccess: true,
    errorCode: null, // No error for success
    message, // Optional success message
    result, // Actual data returned
  });
};

export default successResponse;
