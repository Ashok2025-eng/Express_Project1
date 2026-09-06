import express from "express";
import { deactivate, getAll, getById } from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { Role } from "../types/enum.types";
import {
  deactivateUserValidator,
  getUserByIdValidator,
} from "../validators/user.validator";

const router = express.Router();

router.get("/", protect([Role.ADMIN]), getAll);
router.get("/:id", protect(), validate(getUserByIdValidator), getById);
router.patch(
  "/:id/deactivate",
  protect(),
  validate(deactivateUserValidator),
  deactivate,
);

export default router;
