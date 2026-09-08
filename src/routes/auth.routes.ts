import express from "express";
import {
  changePassword,
  confirmChangeEmail,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  requestChangeEmail,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import multerFileUploader from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validator.middleware";
import { loginValidatorSchema } from "../validators/auth.validator";

const router = express.Router();

const upload = multerFileUploader();

//* register user
router.post("/register", upload.single("profile_image"), register);

//* login
router.post("/login", validate(loginValidatorSchema), login);

//* change password
router.put("/password", changePassword);

//*Logout
router.post("/logout", protect(), logout);

//*get profile
router.get("/profile", protect(), getProfile);

//* forgot-password
router.post("/forgot-password", forgotPassword);

// Email modification endpoints
router.post("/request-change-email", protect(), requestChangeEmail);
router.post("/confirm-change-email", protect(), confirmChangeEmail);

export default router;
