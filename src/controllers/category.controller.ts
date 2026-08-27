import { Request, Response } from "express";
import fs from "fs";
import Category from "../models/category.model"; // Adjust your path
import AppError from "../utils/appError.utils";
import catchAsync from "../utils/catchAsync.utils"; // Adjust your path
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinary.utils";
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
  const file = req.file;
  if (!file) {
    throw new AppError("category image is required", 400);
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    throw new AppError(`Category ${name} already exists`, 400);
  }
  //PLaceholder for track cloudinary data for error cleanup
  let cloudinaryPublicId: string | null = null;
  let categoryImageUrl: string | null = null;

  try {
    const result = await uploadFileToCloudinary(file, "/categories");
    categoryImageUrl = result.path;
    cloudinaryPublicId = result.public_id;

    //Instantly wipe temporary file created by multer on our server
    fs.unlink(file.path, (err) => {
      if (err) console.error("Temporary server file delation failed", err);
    });

    const category = new Category({
      name,
      description,
      image: categoryImageUrl,
      imagePublicId: cloudinaryPublicId,
    });

    //upload image
    category.image = file.path;

    //* must be saved ib databse before below case
    await category.save();

    sendResponse(res, {
      message: `category:${category.name} created`,
      statusCode: 201,
      data: category,
    });
  } catch (error) {
    if (cloudinaryPublicId) {
      await deleteFileFromCloudinary(cloudinaryPublicId);
    }

    // Safety check: remove local file if it managed to persist
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    throw error;
  }
});

//* update
export const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file; // Caught by Multer if a new image is provided

  // 1. Fetch the category first to see if it exists and to grab its current image settings
  const existingCategory = await Category.findById(id);
  if (!existingCategory) {
    // If they uploaded a new image file but the category ID is fake, delete the local temp file immediately
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    throw new AppError("Category not found", 404);
  }

  // 2. Setup our basic text updates
  const updateData: any = { name, description };

  // Track old and new IDs to manage asset states safely
  const oldPublicId = existingCategory.imagePublicId;
  let newCloudinaryPublicId: string | null = null;

  try {
    // 3. Only step into Cloudinary processing IF a file actually exists in the request
    if (file) {
      // Upload new file using your utility (this handles deleting the local file on success)
      const result = await uploadFileToCloudinary(file, "/categories");

      // Inject cloud values into our database payload object
      updateData.image = result.path;
      updateData.imagePublicId = result.public_id;
      newCloudinaryPublicId = result.public_id; // Bookmark it for failure fallbacks
    }

    // 4. Update the document in MongoDB using your built payload object
    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // 5. SUCCESS CLEANUP: Wipe the old image off Cloudinary so your storage doesn't inflate
    if (file && oldPublicId) {
      await deleteFileFromCloudinary(oldPublicId);
    }

    sendResponse(res, {
      message: `Category updated successfully`,
      statusCode: 200,
      data: category,
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

  // 1. Fetch the category document first to grab the stored cloud asset tracking credentials
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // 2. Clear out your Cloudinary dashboard folder using the stored publicId string token
  if (category.imagePublicId) {
    await deleteFileFromCloudinary(category.imagePublicId);
  }

  // 3. Drop the record out of MongoDB completely now that asset cleanup is finished
  await category.deleteOne();

  // 4. Send a clean response back to client
  sendResponse(res, {
    message: `Category:${category.name} and its cloud assets deleted successfully`, // Using category.name is friendlier than id!
    statusCode: 200,
    data: null,
  });
});
