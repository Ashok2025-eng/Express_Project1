import express from "express";
import { create, getAll, getById } from "../controllers/product.controller";
import multerFileUploader from "../middlewares/multer.middleware";

const router = express.Router();
const upload = multerFileUploader();

router.get("/", getAll);

router.get("/:id", getById);

router.post(
  "/",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 6,
    },
  ]),

  create,
);

export default router;
