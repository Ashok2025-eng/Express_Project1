import { NextFunction, Request, Response } from "express";

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
    stack: error?.stack ?? null,
  });
};

export default errorHandler;