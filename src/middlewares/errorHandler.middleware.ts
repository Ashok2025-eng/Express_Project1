import { NextFunction, Request, Response } from "express";
import ENV_CONFIG from "../config/env.config";

const errorHandler = (
  error: any,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  // 1. Safe fallbacks for status codes and formatting messages
  const statusCode = typeof error?.statusCode === "number" ? error.statusCode : 500;
  const message = error?.message || "Internal server error";
  const status = error?.status || "error";
  const success = error?.success ?? false;

  // 2. Safe check for Node environment string matching
  const isDevelopment = ENV_CONFIG?.NODE_ENV === "development" || process.env.NODE_ENV === "development";

  //* send error response
  res.status(statusCode).json({
    message,
    success,
    status,
    data: null,
    details: error?.details || null,
    stack: isDevelopment ? error?.stack : null, // Safely handles production masking
  });
};

export default errorHandler;
