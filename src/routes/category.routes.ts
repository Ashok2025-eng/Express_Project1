import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/category.controller";
import multerFileUploader from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validator.middleware";
import {
  deleteCategoryValidator,
  getCategoryByIdValidator,
  updateCategoryValidator,
} from "../validators/category.validator";
import { createCategoryValidator } from "../validators/category.validator";

const upload = multerFileUploader();

const router = express.Router();

//* get all
router.get("/", getAll);

//*getByid
router.get("/:id", validate(getCategoryByIdValidator), getById);

//* create
router.post(
  "/",
  upload.single("image"),
  validate(createCategoryValidator),
  create,
);

//* update
router.put(
  "/:id",
  upload.single("image"),
  validate(updateCategoryValidator),
  update,
);

//* delete
router.delete("/:id", validate(deleteCategoryValidator), remove);

export default router;
