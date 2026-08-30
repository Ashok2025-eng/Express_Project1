import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import AppError from "../utils/appError.utils";

export const validate = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (result.error) {
      const errors = result.error.issues.map(({ path, message }) => {
        return {
          message,
          path: path.join("."),
        };
      });

      next(new AppError(errors[0]?.message || "Validation Error", 400, errors));
      return;
    }

    req.body = result.data.body;
    Object.assign(req.params, result.data.params);
    Object.assign(req.query, result.data.query);
    next();
  };
};
