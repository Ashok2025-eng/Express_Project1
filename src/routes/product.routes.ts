import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/product.controller";
import { protect } from "../middlewares/auth.middleware"; // 🔐 Your reusable auth gate
import multerFileUploader from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validator.middleware";
import { Role } from "../types/enum.types"; // 🔐 Your Role enum
import {
  createProductValidator,
  deleteProductValidator,
  getProductByIdValidator,
  updateProductValidator,
} from "../validators/product.validator";

const router = express.Router();
const upload = multerFileUploader();

/**
 * 📁 Multer Multi-Field Interceptor Configuration:
 * Maps incoming file fields to your controller arrays
 */
const productMediaFields = upload.fields([
  { name: "cover_image", maxCount: 1 }, // Single file structure
  { name: "images", maxCount: 5 }, // Array collection structure
]);

//* Public Read Routes
router.get("/", getAll);
router.get("/:id", validate(getProductByIdValidator), getById);

//* Admin Write Routes (Protected by Role Gate Matrix)
router.post(
  "/",
  protect([Role.ADMIN]), // 🛡️ Shielded entry gate
  productMediaFields,
  validate(createProductValidator),
  create,
);

router.put(
  "/:id",
  protect([Role.ADMIN]), // 🛡️ Shielded entry gate
  productMediaFields,
  validate(updateProductValidator),
  update,
);

router.delete(
  "/:id",
  protect([Role.ADMIN]), // 🛡️ Shielded entry gate
  validate(deleteProductValidator),
  remove, // Safe to leave active now that the function exists in your controller!
);

export default router;
