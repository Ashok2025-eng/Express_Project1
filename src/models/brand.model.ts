import mongoose, { Document } from "mongoose";

//* interface

interface IBrandDocument extends Document {
  name: string;
  description: string;
  logo: string;
  logoPublicId: string;
}
//* Schema

const brandSchema = new mongoose.Schema(
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

    logo: {
      type: String,
      required: [true, "logo is required"],
    },
    logoPublicId: {
      type: String,
      required: [true, "Image public ID is required"],
    },
  },
  { timestamps: true },
);

const Brand = mongoose.model<IBrandDocument>("Brand", brandSchema);
export default Brand;
