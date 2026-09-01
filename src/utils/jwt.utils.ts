import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ENV_CONFIG from "../config/env.config";
import { Role } from "../types/enum.types";

interface IJwtPayload {
  _id: mongoose.Types.ObjectId | string;
  role: Role;
  email: string;
}

export interface IJwtReturn {
  id: string; // We will make sure _id maps to id cleanly during verification
  email: string;
  role: Role;
}

//* Generate jwt token
export const generateJwtToken = (payload: IJwtPayload) => {
  try {
    return jwt.sign(payload, ENV_CONFIG.JWT_SECRET, {
      expiresIn: ENV_CONFIG.JWT_EXPIRES_IN as any,
    });
  } catch (error) {
    console.error("JWT Generation Error:", error);
    throw error;
  }
};

//* Verify jwt token
export const verifyToken = (token: string): IJwtReturn => {
  try {
    // 1. Decode the token using the original payload structure containing _id
    const decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET) as {
      _id: string;
      email: string;
      role: Role;
    };

    // 2. Map the payload values cleanly to match your IJwtReturn type structure
    return {
      id: decoded._id, // Convert mongo _id over to the id field used by your req.user interface
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    console.error("JWT Verification Utility Error:", error);
    throw error;
  }
};
