import { v2 as cloudinary } from "cloudinary";
import ENV_CONFIG from "./env.config"; // Adjust the path to your config
// Initialize Cloudinary configurations
cloudinary.config({
  cloud_name: ENV_CONFIG.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_CONFIG.CLOUDINARY_API_KEY,
  api_secret: ENV_CONFIG.CLOUDINARY_API_SECRET,
});

// // /**
// //  * 1. Upload Helper
// //  */
// export const uploadFileToCloudinary = async (
//   file: Express.Multer.File,
//   folder: string,
// ) => {
//   try {
//     const response = await cloudinary.uploader.upload(file.path, {
//       folder: `your_app_name${folder}`,
//       resource_type: "auto",
//     });

//     return {
//       path: response.secure_url, // Saved to category.image
//       public_id: response.public_id, // Saved to category.imagePublicId
//     };
//   } catch (error: any) {
//     if (fs.existsSync(file.path)) {
//       fs.unlinkSync(file.path);
//     }
//     throw new Error(`Cloudinary Upload Failed: ${error.message}`);
//   }
// };

// // /**
// //  * 2. Delete Helper -> PLACE IT HERE
// //  */
// export const deleteFromCloudinary = async (publicId: string) => {
//   try {
//     // This talks to the Cloudinary API and permanently deletes the asset
//     const response = await cloudinary.uploader.destroy(publicId);
//     return response;
//   } catch (error: any) {
//     console.error("Cloudinary Deletion Error:", error);
//     // Return null instead of throwing so it doesn't break your API response cycle
//     return null;
//   }
// };
// You added this at the bottom
export default cloudinary;
