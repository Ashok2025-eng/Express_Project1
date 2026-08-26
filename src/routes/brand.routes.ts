import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/brand.controller";
import multerFileUploader from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validator.middleware";
import {
  deleteBrandValidator,
  getBrandByIdValidator,
  updateBrandValidator,
} from "../validators/brand.validator";

const router = express.Router();
const upload = multerFileUploader();

router.get("/", getAll);

router.get("/:id", validate(getBrandByIdValidator), getById);

router.post(
  "/",
  upload.single("logo"),
  //  validate(createBrandValidator),
  create,
);

router.put(
  "/:id",
  upload.single("logo"),
  validate(updateBrandValidator),
  update,
);

router.delete("/:id", validate(deleteBrandValidator), remove);

export default router;
