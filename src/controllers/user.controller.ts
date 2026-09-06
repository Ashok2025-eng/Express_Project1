import { Request, Response } from "express";
import User from "../models/user.model";
import { Role } from "../types/enum.types";
import AppError from "../utils/appError.utils";
import catchAsync from "../utils/catchAsync.utils";
import sendResponse from "../utils/sendResponse.utils";

export const getAll = catchAsync(async (req: Request, res: Response) => {
  if (req.user && req.user.role !== Role.ADMIN) {
    throw new AppError(
      "You do not have permission to perform this action",
      403,
    );
  }
  const user = await User.find().select("-password");

  sendResponse(res, {
    message: "All users fetched successfully",
    statusCode: 200,
    data: user,
  });
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById().select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  sendResponse(res, {
    message: "User profile fetched successfully",
    statusCode: 200,
    data: user,
  });
});

export const deactivate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true, runValidators: true },
  ).select("-password");

  sendResponse(res, {
    message: `User account for ${user.full_name} has been successfully deactivated`,
    statusCode: 200,
    data: updatedUser,
  });
});
