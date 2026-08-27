//user:user:id,product:product:id

import mongoose, { Document } from "mongoose";

interface IWishlistDocument extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
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
  },
  { timestamps: true },
);

const Wishlist = mongoose.model<IWishlistDocument>("wishlist", wishlistSchema);
export default Wishlist;
