import mongoose from "mongoose";

//* interface

interface ICategoryDocument extends Document {
  name: string;
  description: string;
  image: string;
  imagePublicId: string;
}
//* Schema

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      minLength: 3,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [10, "description at least 10 character"],
    },

    image: {
      type: String,
      required: [true, "image is required"],
    },
    imagePublicId: {
      type: String,
      required: [true, "Image public ID is required"], // Crucial for Cloudinary management
    },
  },
  { timestamps: true },
);

const Category = mongoose.model<ICategoryDocument>("Category", categorySchema);
export default Category;
