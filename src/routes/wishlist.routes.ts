import express from "express";
import {
  clearWishlist,
  getUserWishlist,
  toggleWishlist,
} from "../controllers/wishlist.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import {
  clearWishlistValidator,
  getWishlistValidator,
  toggleWishlistValidator,
} from "../validators/wishlist.validator";

const router = express.Router();

router.post("/", protect, validate(toggleWishlistValidator), toggleWishlist);
router.get("/:userId", validate(getWishlistValidator), getUserWishlist);
router.delete(
  "/clear/:userId",
  validate(clearWishlistValidator),
  clearWishlist,
);

export default router;
