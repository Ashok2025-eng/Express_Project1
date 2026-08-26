import mongoose from "mongoose";
interface IImageDocument extends Document {
  path: string;
  public_id: string;
}

const imageSchema = new mongoose.Schema<IImageDocument>(
  {
    path: {
      type: String,
      required: [true, "image path is required"],
    },
    public_id: {
      type: String,
      required: [true, "image public_id is required"],
    },
  },
  { _id: false },
);

export default imageSchema;
