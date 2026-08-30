import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/product.controller";
import multerFileUploader from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validator.middleware";
import {
  createProductValidator,
  deleteProductValidator,
  getProductByIdValidator,
  updateProductValidator,
} from "../validators/product.validator";

const router = express.Router();
const upload = multerFileUploader(); // Execute the instance function

//* 1. Read Operations (No Multer Needed)
router.get("/", getAll);
router.get("/:id", validate(getProductByIdValidator), getById);

//* 2. Create Operation (Multer parses fields/files first, then Zod validates)
router.post(
  "/",
  upload.fields([
    { name: "cover_image", maxCount: 1 }, // Expects exactly 1 file under the key 'cover_image'
    { name: "images", maxCount: 8 }, // Expects up to 8 files under the key 'images'
  ]),
  validate(createProductValidator),
  create,
);

//* 3. Update Operation
router.put(
  "/:id",
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]),
  validate(updateProductValidator),
  update,
);

//* 4. Delete Operation (No Multer Needed)
router.delete("/:id", validate(deleteProductValidator), remove);

export default router;
