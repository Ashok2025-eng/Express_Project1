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
    console.log("Cloudinary deletion failed:", error);
    // Return null instead of throwing so a failed media deletion doesn't crash your server response
    return null;
  }
};
