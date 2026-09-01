import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import { verifyToken } from "../utils/jwt.utils"; // 1. Import your fixed token helper
import { IJwtReturn } from "./../utils/jwt.utils";
import { Role } from "../types/enum.types";





/**
 * Combined Gatekeeper: Handles token validation AND role checking at the same time
 */
export const protect = (allowedRoles: Role[] = []) => {
  // 2. Expect an array of Role enums
  return (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Access denied. Please log in first.", 401);
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded;

      // 3. ENFORCE ROLE CHECKS: Validate against the enum rules array
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        throw new AppError(
          "Access denied. Administrative privileges required.",
          403,
        );
      }

      next();
    } catch (error) {
      next(
        error instanceof AppError
          ? error
          : new AppError("Invalid or expired session token", 401),
      );
    }
  };
};
