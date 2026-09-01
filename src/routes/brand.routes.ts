import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/brand.controller";
import { protect } from "../middlewares/auth.middleware"; // 🔐 Imported your reusable auth gate
import multerFileUploader from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validator.middleware";
import { Role } from "../types/enum.types"; // 🔐 Imported your Role enum
import {
  createBrandValidator,
  deleteBrandValidator,
  getBrandByIdValidator,
  updateBrandValidator,
} from "../validators/brand.validator";

const router = express.Router();
const upload = multerFileUploader();

//* Public Read Routes
router.get("/", getAll);

router.get("/:id", validate(getBrandByIdValidator), getById);

//* Admin Write Routes (Protected with Role-Based Authentication)
router.post(
  "/",
  protect([Role.ADMIN]), // 🛡️ Restricts creation to Admins only
  upload.single("logo"),
  validate(createBrandValidator),
  create,
);

router.put(
  "/:id",
  protect([Role.ADMIN]), // 🛡️ Restricts modification to Admins only
  upload.single("logo"),
  validate(updateBrandValidator),
  update,
);

router.delete(
  "/:id", 
  protect([Role.ADMIN]), // 🛡️ Restricts deletion to Admins only
  validate(deleteBrandValidator), 
  remove
);

export default router;
