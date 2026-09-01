import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/category.controller";
import { protect } from "../middlewares/auth.middleware"; // Import protect
import multerFileUploader from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validator.middleware";
import { Role } from "../types/enum.types"; // Import Role Enum
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validators/category.validator";

const router = express.Router();
const upload = multerFileUploader();

//* Public Read Routes
router.get("/", getAll);
router.get("/:id", getById);

//* Admin Write Routes
router.post(
  "/",
  protect([Role.ADMIN]),
  upload.single("image"),
  validate(createCategoryValidator),
  create,
);

// ✅ Added protect to PUT
router.put(
  "/:id",
  protect([Role.ADMIN]),
  upload.single("image"),
  validate(updateCategoryValidator),
  update,
);

// ✅ Added protect to DELETE (No file upload middleware needed here!)
router.delete("/:id", protect([Role.ADMIN]), remove);

export default router;
