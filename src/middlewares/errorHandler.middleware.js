import { Request, Response, NextFunction } from "express";
import { IsApiError, ApiError } from "../utils/ApiError";
const currentEnv = process.env.NODE_ENV || "development";

/**
 * Global error handler for all routes
 * @param {ApiError} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export default (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  if (IsApiError(err)) {
    // Use the .toObject() method for structured error response if it exists

    const response = typeof err.toObject === "function" ? err.toObject() : { message: err.message };
    return res.status(err.statusCode).json(response);
  }

  if (currentEnv === "development") {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }

  console.log(err);
  return res.status(500).send("Something went wrong");
};
