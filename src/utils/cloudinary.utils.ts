import fs from "fs";
import cloudinary from "../config/cloudinary.config";
import AppError from "./appError.utils";

//* upload
export const uploadFileToCloudinary = async (
  file: Express.Multer.File,
  dir = "/",
) => {
  try {
    const folder = "/team_18" + dir;
    const { public_id, secure_url: path } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: folder,
        unique_filename: true,
      },
    );

    //* delete local temp file on success
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return {
      path,
      public_id,
    };
  } catch (error) {
    // If the Cloudinary upload itself fails, clean up the local temp file immediately
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    console.log(error);
    throw new AppError("Something went wrong with cloud upload", 400);
  }
};

//* delete from cloudinary (ADD THIS HERE)
export const deleteFileFromCloudinary = async (publicId: string) => {
  try {
    // This removes the asset from your Cloudinary bucket completely
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    console.log("Cloudinary deletion failed:", error, 400);
    // Return null instead of throwing so a failed media deletion doesn't crash your server response
    return null;
  }
};

//* Upload multiple files or images
/**
 * Uploads an array of multiple local files to Cloudinary at once
 * Added explicit return type: Promise<{ path: string; public_id: string }[]>
 */
export const uploadMultipleFilesToCloudinary = async (
  files: Express.Multer.File[],
  dir = "/",
): Promise<{ path: string; public_id: string }[]> => {
  // ⬅️ Add this type boundary!
  const uploadedImages: { path: string; public_id: string }[] = []; // ⬅️ Explicit array typing

  try {
    for (const file of files) {
      const folder = "/team_18" + dir;
      const { public_id, secure_url: path } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: folder,
          unique_filename: true,
        },
      );

      // Delete the local temporary file right after a successful cloud upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      uploadedImages.push({ path, public_id });
    }

    return uploadedImages; // ⬅️ ENSURE THIS RETURN IS INSIDE THE TRY BLOCK
  } catch (error) {
    // If ANY image upload crashes, clear remainders from local disk
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
    console.log(error);
    throw new AppError("Something went wrong with multiple cloud uploads", 400);
  }
};
