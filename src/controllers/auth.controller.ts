import { Request, Response } from "express";
import ENV_CONFIG from "../config/env.config";
import User from "../models/user.model";
import AppError from "../utils/appError.utils";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinary.utils";

import Otp from "../models/otp.model";
import { OtpType } from "../types/enum.types";
import {
  changeEmailOtpSendHtml,
  forgotPasswordOtpSendHtml,
  generateAccountCreatedHtml,
  generateLoginDetectedHtml,
} from "../utils/emailTemplate.utils";
import { generateJwtToken } from "../utils/jwt.utils";
import { createHash, generateOtp } from "../utils/otp.utils";
import { sendEmail } from "../utils/sendEmail.utils";
import sendResponse from "../utils/sendResponse.utils";

//* register
export const register = catchAsync(async (req: Request, res: Response) => {
  // data:full_name, email , password , phone
  const { full_name, email, password, phone } = req.body;
  const file = req.file;

  if (!full_name) {
    throw new AppError("full_name is required", 400);
  }

  if (!email) throw new AppError("email is required", 400);

  if (!password) {
    throw new AppError("password is required", 400);
  }

  //* create user instance
  const user = new User({ full_name: full_name, email, phone, password });

  //* hash password
  const hash = await hashPassword(password);
  user.password = hash;

  //* upload profile image
  if (file) {
    //* upload file to cloudinary
    const { path, public_id } = await uploadFileToCloudinary(
      file,
      "/profile_images",
    );
    // user.profile_image = file.path;
    user.profile_image = {
      path,
      public_id,
    };
  }

  //* save user
  await user.save();

  //* send email safely without freezing the response loop
  try {
    await sendEmail({
      to: user.email,
      subject: "Account Created",
      html: generateAccountCreatedHtml({
        full_name: user.full_name,
        email: user.email,
        created_at: new Date(Date.now()),
        user_agent: req.headers["user-agent"],
      }),
    });
  } catch (emailError) {
    console.error("🚨 Email notification failed to deliver:", emailError);
  }

  //* convert user document to object & destructure
  const { password: _, ...rest } = user.toObject();

  //* send success response
  sendResponse(res, {
    message: "Account created",
    statusCode: 201,
    data: rest,
  });
});

//* login
export const login = catchAsync(async (req: Request, res: Response) => {
  // email password
  const { email, password } = req.body;

  //* find user by email
  const user = await User.findOne({ email }).select("+password");

  //*
  if (!user) throw new AppError("credentials does not matched", 400);

  //* compare password
  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched)
    throw new AppError("credentials does not matched", 400);

  //* create jwt access_token
  const access_token = generateJwtToken({
    _id: user._id,
    email: user.email,
    role: user.role,
  });

  //* convert user document to object & destructure
  const { password: _, ...rest } = user.toObject();

  //* send email
  sendEmail({
    to: user.email,
    subject: "New Login Detected",
    html: generateLoginDetectedHtml({
      full_name: user.full_name,
      email: user.email,
      logged_in_at: new Date(Date.now()),
      user_agent: req.headers["user-agent"],
    }),
  });

  //* set cookie header
  res.cookie("access_token", access_token, {
    secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
    httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
    // expires: new Date(
    //   Date.now() + ENV_CONFIG.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    // ),
    maxAge: ENV_CONFIG.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
  });

  // res.cookie("abc", "abc123");

  //* send success response
  sendResponse(res, {
    message: "login success",
    data: {
      user: rest,
      access_token,
    },
    statusCode: 201,
  });
});

//* change password
export const changePassword = catchAsync(async (req, res) => {
  const { old_password, new_password } = req.body;
  const { _id } = req.user;

  if (!new_password) throw new AppError("new password is required", 400);
  if (!old_password) throw new AppError("old password is required", 400);

  const user = await User.findById(_id).select("+password");

  if (!user) throw new AppError("user not found", 400);

  const isPassMatched = await comparePassword(old_password, user.password);

  if (!isPassMatched) throw new AppError("password does not matched", 400);

  const hash = await hashPassword(new_password);

  user.password = hash;

  await user.save();

  //* send email

  sendResponse(res, {
    message: "password updated",
    data: null,
    statusCode: 200,
  });
});

//* logout
export const logout = catchAsync(async (req, res) => {
  res.clearCookie("access_token", {
    secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
    httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
    maxAge: Date.now(),
    sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
  });

  sendResponse(res, {
    message: "logout success",
    data: null,
    statusCode: 200,
  });
});
//* get profile
export const getProfile = catchAsync(async (req, res) => {
  const { _id } = req.user;

  const profile = await User.findOne({ _id });

  if (!profile) throw new AppError("profile not found", 404);

  sendResponse(res, {
    message: "profile fetched",
    data: profile,
    statusCode: 200,
  });
});

//* forgot password
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("email is required", 400);
  }

  const account = await User.findOne({ email });

  if (!account) {
    throw new AppError("account not found", 404);
  }

  //* generate otp
  const { otp, hash, expiry } = generateOtp();

  //* save otp
  await Otp.create({
    hash,
    user: account._id,
    action: OtpType.FORGOT_PASSWORD,
    expiresAt: expiry,
  });

  //* send otp email
  sendEmail({
    to: account.email,
    subject: "Reset Password",
    html: forgotPasswordOtpSendHtml({ otp, email }),
  });

  //* send success response
  sendResponse(res, {
    message: `otp sent to: ${account.email}`,
    data: null,
    statusCode: 201,
  });
});

//* reset password
export const resetPassword = catchAsync(async (req, res) => {
  const { password, otp } = req.body;
  if (!password) throw new AppError("password is required", 400);
  if (!otp) throw new AppError("otp is required", 400);

  const otpHash = await Otp.findOne({
    hash: createHash(otp),
    action: OtpType.FORGOT_PASSWORD,
    expiresAt: { $gt: new Date() },
  });

  if (!otpHash) throw new AppError("otp does not exists or expired", 400);

  const passHash = await hashPassword(password);

  await User.findByIdAndUpdate(otpHash.user, {
    password: passHash,
  });

  otpHash.active = false;
  otpHash.expiresAt = null;

  await otpHash.save();

  sendResponse(res, {
    message: "password updated",
    data: null,
    statusCode: 200,
  });
});

//* change email
//* REQUEST CHANGE EMAIL
export const requestChangeEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { new_email } = req.body;
    const { _id, email: current_email } = req.user;

    if (!new_email) throw new AppError("New email is required", 400);
    if (new_email === current_email)
      throw new AppError("New email must be different from current email", 400);

    const isEmailTaken = await User.findOne({ email: new_email });
    if (isEmailTaken)
      throw new AppError("Email is already in use by another account", 400);

    const { otp, hash, expiry } = generateOtp();

    await Otp.create({
      hash,
      user: _id,
      action: OtpType.CHANGE_EMAIL,
      expiresAt: expiry,
      active: true,
    });

    // Uses your layout perfectly
    sendEmail({
      to: new_email,
      subject: "Verify Your New Email Address",
      html: changeEmailOtpSendHtml({
        otp,
        email: new_email,
        requested_at: new Date(),
      }),
    }).catch((err) =>
      console.error("🚨 Change email OTP delivery failed:", err),
    );

    sendResponse(res, {
      message: `Verification OTP sent to your new email: ${new_email}`,
      data: null,
      statusCode: 200,
    });
  },
);

//* confirm change email
export const confirmChangeEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { new_email, otp } = req.body;
    const { _id } = req.user;

    if (!new_email) throw new AppError("new email is required", 400);
    if (!otp) throw new AppError("otp is required", 400);

    //* find and validate otp hash
    const otpHash = await Otp.findOne({
      hash: createHash(otp),
      user: _id,
      action: OtpType.CHANGE_EMAIL,
      active: true,
      expiresAt: { $gt: new Date() },
    });

    if (!otpHash) throw new AppError("otp does not exists or expired", 400);

    //* check if the new email is already taken before updating
    const isEmailTaken = await User.findOne({ email: new_email });
    if (isEmailTaken) throw new AppError("email is already in use", 400);

    //* update user email
    await User.findByIdAndUpdate(_id, { email: new_email });

    //* invalidate otp
    otpHash.active = false;
    otpHash.expiresAt = null;
    await otpHash.save();

    sendResponse(res, {
      message: "email updated",
      data: null,
      statusCode: 200,
    });
  },
);

//* update profile image
export const changeProfileImage = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const file = req.file;
  if (!file) throw new AppError("image is required", 400);

  const user = await User.findById(_id);

  if (!user) throw new AppError("profile not found", 400);

  const { public_id, path } = await uploadFileToCloudinary(
    file,
    "/profile_images",
  );

  if (user.profile_image) {
    await deleteFileFromCloudinary(user.profile_image?.public_id);
  }

  user.profile_image = {
    public_id,
    path,
  };

  await user.save();

  sendResponse(res, {
    message: "profile updated",
    data: user,
    statusCode: 200,
  });
});
