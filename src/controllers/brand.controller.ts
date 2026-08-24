import { Request, Response } from "express";

// import express from "express";
import AppError from "../utils/appError.utils";

import Brand from "../models/brand.model";
import catchAsync from "../utils/catchAsync.utils";
import sendResponse from "../utils/sendResponse.utils";

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filter = {};

  const brands = await Brand.find(filter);

  //* send success response
  sendResponse(res, {
    message: "Brands fetched",
    data: brands,
    statusCode: 200,
  });
});

//* getbyid
export const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findById({ _id: id });
  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  //* send success response
  sendResponse(res, {
    message: "brand fetched",
    data: brand,
    statusCode: 200,
  });
});

//* Post or create

export const create = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  // 1. Fixed 'new' syntax, changed variable name to brand, and changed dot to comma
  const brand = new Brand({ name, description });

  // 2. Safely saves to the database unit
  await brand.save();

  // 3. Variables now align correctly
  sendResponse(res, {
    message: `brand:${brand.name} created`,
    statusCode: 201,
    data: brand,
  });
});

//* update

export const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    id,
    { name, description },
    { new: true, runValidators: true },
  );

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }
  sendResponse(res, {
    message: `Brand updated successfully`,
    statusCode: 200,
    data: brand,
  });
});

//* delete
export const remove = catchAsync(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndDelete(id);

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  //send a clean response back to client
  sendResponse(res, {
    message: `Brand:${brand.id} deleted successfully`,
    statusCode: 200,
    data: null,
  });
});
