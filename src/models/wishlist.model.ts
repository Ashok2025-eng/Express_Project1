import mongoose, { Document } from "mongoose";
import { IImage } from "../types/global.types";
import imageSchema from "./image.model"; // Make sure this path to image.model.ts is exactly correct!

export interface IWishlistDocument extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  cover_image: IImage;
  images: IImage[];
}

const wishlistSchema = new mongoose.Schema<IWishlistDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user is required"],
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "product is required"],
      ref: "product",
    },
    cover_image: {
      type: imageSchema, // ✅ Explicitly checking for cover_image rules
      required: [true, "wishlist cover image is required"],
    },
    images: {
      type: [imageSchema], // ✅ Explicitly checking for images list rules
      required: [true, "wishlist gallery images are required"],
    },
  },
  { timestamps: true },
);

const Wishlist = mongoose.model<IWishlistDocument>("wishlist", wishlistSchema);
export default Wishlist;
