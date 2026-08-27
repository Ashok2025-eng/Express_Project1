import { Request, Response } from "express";
import Product from "../models/product.model";
import AppError from "../utils/appError.utils";
import catchAsync from "../utils/catchAsync.utils";
import sendResponse from "../utils/sendResponse.utils";

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filter = {};

  const products = await Product.find(filter);

  sendResponse(res, {
    message: "product fetched",
    data: products,
    statusCode: 200,
  });
});

//* getbyid
export const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById({ _id: id });
  if (!product) {
    throw new AppError("product not found", 404);

    sendResponse(res, {
      message: "product fetched",
      data: product,
      statusCode: 200,
    });
  }
});

export const create = catchAsync(async (req: Request, res: Response) => {});
