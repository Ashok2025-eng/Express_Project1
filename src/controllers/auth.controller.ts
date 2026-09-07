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
import {
  generateAccountCreatedHtml,
  generateLoginDetectedHtml,
} from "../utils/emailTemplate.utils";
import { generateJwtToken } from "../utils/jwt.utils";
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

//* change email

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
