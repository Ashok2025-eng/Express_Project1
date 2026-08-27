import { Request, Response } from "express";
import { uploadFileToCloudinary } from "./../utils/cloudinary.utils";

// import express from "express";
import AppError from "../utils/appError.utils";

import fs from "fs";
import Brand from "../models/brand.model";
import catchAsync from "../utils/catchAsync.utils";
import { deleteFileFromCloudinary } from "../utils/cloudinary.utils";
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

  const file = req.file;
  if (!file) {
    throw new AppError("Brand logo is required", 400);
  }

  const existingBrand = await Brand.findOne({ name });
  if (existingBrand) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    throw new AppError(`Brand:${name} already exists`, 400);
  }

  let logoPublicId: string | null = null;
  let brandImageUrl: string | null = null;

  try {
    const result = await uploadFileToCloudinary(file, "/brands");
    brandImageUrl = result.path;
    logoPublicId = result.public_id;

    fs.unlink(file.path, (err) => {
      if (err) console.log("Temporary server file delation failed", err);
    });

    const brand = new Brand({
      name,
      description,
      logo: brandImageUrl,
      logoPublicId: logoPublicId,
    });

    // brand.logo = file.path;
    // 2. Safely saves to the database unit
    await brand.save();

    // 3. Variables now align correctly
    sendResponse(res, {
      message: `brand:${brand.name} created`,
      statusCode: 201,
      data: brand,
    });
  } catch (error) {
    if (logoPublicId) {
      await deleteFileFromCloudinary(logoPublicId);
    }
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
});

//* update

export const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file;

  const existingBrand = await Brand.findById(id);
  if (!existingBrand) {
    throw new AppError("Brand not found", 400);
  }

  const updateData: any = { name, description };

  const oldPublicId = existingBrand.logoPublicId;
  let newCloudinaryPublicId: string | null = null;

  try {
    // 3. Only step into Cloudinary processing IF a file actually exists in the request
    if (file) {
      // Upload new file using your utility (this handles deleting the local file on success)
      const result = await uploadFileToCloudinary(file, "/brands");
      // Inject cloud values into our database payload object
      updateData.logo = result.path;
      updateData.logoPublicId = result.public_id;
      newCloudinaryPublicId = result.public_id;
    }
    const brand = await Brand.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    // 5. SUCCESS CLEANUP: Wipe the old image off Cloudinary so your storage doesn't inflate
    if (file && oldPublicId) {
      await deleteFileFromCloudinary(oldPublicId);
    }

    sendResponse(res, {
      message: `Brand updated successfully`,
      statusCode: 200,
      data: brand,
    });
  } catch (error) {
    // 6. FAIL-SAFE: If DB validation/saving crashes, remove the newly uploaded cloud image
    if (newCloudinaryPublicId) {
      await deleteFileFromCloudinary(newCloudinaryPublicId);
    }

    // Emergency cleanup for local files
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    throw error;
  }
});

//* delete
export const remove = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1. Fetch the brand document first to grab the stored logo tracking details
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  // 2. Clear out your Cloudinary dashboard folder using the stored logoPublicId
  if (brand.logoPublicId) {
    await deleteFileFromCloudinary(brand.logoPublicId);
  }

  // 3. Drop the record out of MongoDB completely now that asset cleanup is finished
  await brand.deleteOne();

  // 4. Send a clean response back to client
  sendResponse(res, {
    message: `Brand:${brand.name} and its cloud logo deleted successfully`,
    statusCode: 200,
    data: null,
  });
});
