import { NextFunction, Request, Response } from "express";
import ENV_CONFIG from "../config/env.config";

const errorHandler = (
  error: any,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  const message = error?.message ?? "Internal server error";
  const statusCode = error?.statusCode ?? 500;
  const status = error?.status ?? "error";
  const success = error?.success ?? false;

  //* send error response
  res.status(statusCode).json({
    message,
    success,
    status,
    data: null,
    details: error?.details ?? null,
    stack: ENV_CONFIG.NODE_ENV==="development" ? error?.stack : null,
  });
};

export default errorHandler;