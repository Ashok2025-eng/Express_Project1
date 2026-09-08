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
  resetPassword,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import multerFileUploader from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validator.middleware";
import {
  changePasswordValidatorSchema,
  confirmChangeEmailSchema,
  loginValidatorSchema,
  requestChangeEmailSchema,
  resetPasswordValidatorSchema,
} from "../validators/auth.validator";

const router = express.Router();
const upload = multerFileUploader();

// ==========================================
// 1. PUBLIC ROUTES (Anyone can access)
// ==========================================

//* register user
router.post("/register", upload.single("profile_image"), register);

//* login
router.post("/login", validate(loginValidatorSchema), login);

//* forgot-password
router.post("/forgot-password", forgotPassword);

//* reset-password
router.post(
  "/reset-password",
  validate(resetPasswordValidatorSchema),
  resetPassword,
);

// ==========================================
// 🛡️ THE SECURITY WALL (Everything below this requires login)
// ==========================================
router.use(protect()); 

// ==========================================
// 2. PROTECTED ROUTES (Safe inside the wall)
// ==========================================

//*Logout
router.post("/logout", logout); // Removed duplicate protect() execution

//*get profile
router.get("/profile", getProfile); // Removed duplicate protect() execution

//* change password
router.put(
  "/password",
  validate(changePasswordValidatorSchema),
  changePassword,
);

//* Email modification endpoints
router.post(
  "/request-change-email",
  validate(requestChangeEmailSchema),
  requestChangeEmail,
);

router.post(
  "/confirm-change-email",
  validate(confirmChangeEmailSchema),
  confirmChangeEmail,
);

export default router;
