import express from "express";
import {
  changePassword,
  login,
  register,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validator.middleware";
import { loginValidatorSchema } from "../validators/auth.validator";

const router = express.Router();

//* register user
router.post("/register", register);

//* login
router.post("/login", validate(loginValidatorSchema), login);

//* change password
router.put("/password", changePassword);

export default router;
