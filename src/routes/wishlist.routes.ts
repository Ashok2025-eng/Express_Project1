import express from "express";
import { toggleWishlist, getUserWishlist, clearWishlist } from "../controllers/wishlist.controller";
import { validate } from "../middlewares/validator.middleware";
import { 
  toggleWishlistValidator, 
  getWishlistValidator, 
  clearWishlistValidator 
} from "../validators/wishlist.validator";

const router = express.Router();

router.post("/", validate(toggleWishlistValidator), toggleWishlist);
router.get("/:userId", validate(getWishlistValidator), getUserWishlist);
router.delete("/clear/:userId", validate(clearWishlistValidator), clearWishlist);

export default router;
