import { Request, Response } from "express";
import fs from "fs";
import Product from "../models/product.model";
import Wishlist from "../models/wishlist.model";
import AppError from "../utils/appError.utils";
import catchAsync from "../utils/catchAsync.utils";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
  uploadMultipleFilesToCloudinary,
} from "../utils/cloudinary.utils";
import sendResponse from "../utils/sendResponse.utils";

/**
 * @desc    Toggle product in wishlist with multi-field Multer file processing
 * @route   POST /api/v1/wishlist
 */
export const toggleWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const { user, product } = req.body;
    const userId = user;

    if (!userId) throw new AppError("User ID is required", 400);

    // A. Cast incoming files from upload.fields()
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const coverImageFile = files?.["cover_image"]?.[0]; // Single file object
    const galleryFiles = files?.["images"]; // Array of file objects

    // B. File validation guards to avoid crashing your Mongoose validation rules
    if (!coverImageFile) {
      if (galleryFiles)
        galleryFiles.forEach((f) => {
          if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });
      throw new AppError("Wishlist cover image is required", 400);
    }

    if (!galleryFiles || galleryFiles.length === 0) {
      if (fs.existsSync(coverImageFile.path))
        fs.unlinkSync(coverImageFile.path);
      throw new AppError(
        "At least one gallery image is required in 'images' field",
        400,
      );
    }

    // C. Early database check for product to save cloud bandwidth
    const productExists = await Product.findById(product);
    if (!productExists) {
      if (fs.existsSync(coverImageFile.path))
        fs.unlinkSync(coverImageFile.path);
      galleryFiles.forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
      throw new AppError("Product not found", 404);
    }

    // D. Check if this product is already wishlisted by the user to execute toggle logic
    const existingItem = await Wishlist.findOne({ user: userId, product });

    if (existingItem) {
      // If it exists, clean up the newly uploaded local files and un-favorite the product
      if (fs.existsSync(coverImageFile.path))
        fs.unlinkSync(coverImageFile.path);
      galleryFiles.forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });

      await existingItem.deleteOne();
      return sendResponse(res, {
        message: "Product removed from wishlist",
        statusCode: 200,
        data: null,
      });
    }

    // Tracking pointers for automated crash rollbacks
    let uploadedCover: { path: string; public_id: string } | null = null;
    let uploadedGallery: { path: string; public_id: string }[] = [];

    try {
      // E. Upload graphics metadata configurations over to Cloudinary
      uploadedCover = await uploadFileToCloudinary(
        coverImageFile,
        "/wishlists/covers",
      );
      uploadedGallery = await uploadMultipleFilesToCloudinary(
        galleryFiles,
        "/wishlists/gallery",
      );

      // F. Create your database entry matching your updated required schema layouts
      const newItem = await Wishlist.create({
        user: userId,
        product,
        cover_image: uploadedCover,
        images: uploadedGallery,
      });

      sendResponse(res, {
        message: "Product added to wishlist successfully",
        statusCode: 201,
        data: newItem,
      });
    } catch (error) {
      // G. FAIL-SAFE CLEANUP: Wipe cloud storage if database save drops midway
      if (uploadedCover?.public_id)
        await deleteFileFromCloudinary(uploadedCover.public_id);
      if (uploadedGallery.length > 0) {
        for (const img of uploadedGallery)
          await deleteFileFromCloudinary(img.public_id);
      }
      if (coverImageFile && fs.existsSync(coverImageFile.path))
        fs.unlinkSync(coverImageFile.path);
      if (galleryFiles)
        galleryFiles.forEach((f) => {
          if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });

      throw error;
    }
  },
);

/**
 * @desc    Get user's wishlist items with populated product details
 * @route   GET /api/v1/wishlist/:userId
 */
export const getUserWishlist = catchAsync(
  async (req: Request, res: Response) => {
    // ✅ FIX: Force type cast userId as a strict single string
    const userId = req.params.userId as string;

    // TypeScript safely accepts the query parameter configuration maps now
    const wishlist = await Wishlist.find({ user: userId }).populate({
      path: "product",
      select: "name price cover_image stock",
    });

    sendResponse(res, {
      message: "Wishlist items fetched successfully",
      statusCode: 200,
      data: wishlist,
    });
  },
);

/**
 * @desc    Clear entire wishlist for a user
 * @route   DELETE /api/v1/wishlist/clear/:userId
 */
export const clearWishlist = catchAsync(async (req: Request, res: Response) => {
  // ✅ FIX: Force type cast userId as a strict single string
  const userId = req.params.userId as string;

  // TypeScript will now accept this database query filter safely
  await Wishlist.deleteMany({ user: userId });

  sendResponse(res, {
    message: "Wishlist cleared successfully",
    statusCode: 200,
    data: null,
  });
});
