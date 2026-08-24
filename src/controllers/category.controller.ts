import { Request, Response } from "express";

import Category from "../models/category.model";
import AppError from "../utils/appError.utils";
import catchAsync from "../utils/catchAsync.utils";
import sendResponse from "../utils/sendResponse.utils";

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filter = {};

  const categories = await Category.find(filter);

  //* send success response

  sendResponse(res, {
    message: "Categories fetched",
    data: categories,
    statusCode: 200,
  });
});

//* getByID
export const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById({ _id: id });

  if (!category) throw new AppError("Category not found", 404);

  //* Send success response
  sendResponse(res, {
    message: "category fetched",
    data: category,
    statusCode: 200,
  });
});

export const create = catchAsync(async (req, res) => {
  const { name, description } = req.body;

  const category = new Category({ name, description });

  //* must be saved ib databse before below case
  await category.save();

  sendResponse(res, {
    message: `category:${category.name} created`,
    statusCode: 201,
    data: category,
  });
});

//* update
export const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // Get the ID from the URL path
  const { name, description } = req.body;

  // Find the category by ID and update it with the new data
  // { new: true } returns the updated document instead of the old one
  const category = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true, runValidators: true },
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  sendResponse(res, {
    message: `Category updated successfully`,
    statusCode: 200,
    data: category,
  });
});

//* delete

export const remove = catchAsync(async (req, res) => {
  const { id } = req.params;

  //find category in mongodb and delete it
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  //send a clean response back to client
  sendResponse(res, {
    message: `Category:${category.id} deleted successfully`,
    statusCode: 200,
    data: null,
  });
});
