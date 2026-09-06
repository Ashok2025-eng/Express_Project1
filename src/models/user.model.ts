import mongoose, { Document } from "mongoose";
import { Role } from "../types/enum.types";

interface IUser extends Document {
  full_name: string;
  email: string;
  password: string;
  role: Role;
  profile_image?: {
    path: string;
    public_id: string;
  };
  phone?: string;
}

//* user schema
const userSchema = new mongoose.Schema<IUser>(
  {
    full_name: {
      type: String,
      required: [true, "full_name is required"],
      minLength: [3, "full name must be at least 3 char. long"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "user already exists with provided email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    profile_image: {
      type: {
        path: {
          type: String,
          required: function () {
            return this.profile_image?.public_id != null;
          },
        },
        public_id: {
          type: String,
          required: function () {
            return this.profile_image?.path != null;
          },
        },
      },
      default: null, // Now Mongoose understands this applies to the whole object
    },
    phone: {
      type: String,
      length: 10,
      default: null,
    },
  },
  { timestamps: true },
);

//* model
const User = mongoose.model<IUser>("user", userSchema);
export default User;
