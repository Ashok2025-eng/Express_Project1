import mongoose, { Document } from "mongoose";
import { IImage } from "../types/global.types";
import imageSchema from "./image.model";

interface IProductDocument extends Document {
  name: string;
  price: number;
  description: string;
  stock: number;
  cover_image: IImage;
  images: IImage[];
  brand: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  is_featured?: boolean;
  new_arrival?: boolean;
}

const productSchema = new mongoose.Schema<IProductDocument>(
  {
    name: {
      type: String, // ✅ Fixed 'types' to 'type'
      required: [true, "name is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minLength: [10, "at least 10 characters required"],
    },
    price: {
      type: Number, // ✅ Fixed 'types' to 'type'
      required: [true, "price is required"],
      min: 1,
    },
    stock: {
      type: Number, // ✅ Fixed nested structural layout
      required: [true, "stock is required"],
    },
    is_featured: {
      type: Boolean,
      default: true,
    },
    new_arrival: {
      type: Boolean,
      default: true,
    },
    cover_image: {
      type: imageSchema,
      required: [true, "cover image is required"],
    },
    images: {
      type: [imageSchema],
      required: [true, "images are required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "category is required"],
      ref: "Category",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "brand is required"], // ✅ Fixed error message typo
      ref: "Brand",
    },
  },
  { timestamps: true },
);

const Product = mongoose.model<IProductDocument>("product", productSchema);
export default Product;
