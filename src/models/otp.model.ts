import mongoose, { Document } from "mongoose";
import { OtpType } from "../types/enum.types";

interface IOtpDocument extends Document {
  hash: string;
  user: mongoose.Types.ObjectId;
  action: OtpType;
  expiresAt: NativeDate | null;
  active: boolean;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

const otpSchema = new mongoose.Schema<IOtpDocument>(
  {
    hash: {
      type: String,
      required: [true, "otp hash is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user is required"],
      ref: "user",
    },
    action: {
      type: String,
      enum: Object.values(OtpType),
      required: [true, "action is required"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Otp = mongoose.model<IOtpDocument>("otp", otpSchema);
export default Otp;