import { Request, Response } from "express";
import ENV_CONFIG from "../config/env.config";
import User from "../models/user.model";
import AppError from "../utils/appError.utils";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { uploadFileToCloudinary } from "../utils/cloudinary.utils";
import generateJwtToken from "../utils/jwt.utils";
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

  //todo: upload profile image
  if (file) {
    //* upload file to cloudinary
    const { path, public_id } = await uploadFileToCloudinary(
      file,
      "/profile_images",
    );

    user.profile_image = {
      path,
      public_id,
    };
  }

  //* save user
  await user.save();

  //* convert user document to object & destructure
  const { password: _, ...rest } = user.toObject() as any;

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

  // if (!email) throw new AppError("email is required", 400);
  // if (!password) throw new AppError("password is required", 400);

  //* find user by email
  const user = await User.findOne({ email }).select("+password");

  //*
  if (!user) throw new AppError("credentials does not matched", 400);

  //* compare password
  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched)
    throw new AppError("credentials does not matched", 400);

  //todo: create jwt access_token

  const access_token = generateJwtToken({
    _id: user._id,
    email: user.email,
    role: user.role,
  });

  //* Set cookies

  res.cookie("access_token", access_token, {
    secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
    httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
    expires: new Date(
      Date.now() + ENV_CONFIG.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),

    sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
  });

  //* convert user document to object & destructure
  const { password: _, ...rest } = user.toObject() as any;

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
export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const { old_password, new_password, id } = req.body;

    if (!new_password) throw new AppError("new password is required", 400);
    if (!old_password) throw new AppError("old password is required", 400);

    const user = await User.findById(id).select("+password");

    if (!user) throw new AppError("user not found", 400);

    const isPassMatched = await comparePassword(old_password, user.password);

    if (!isPassMatched) throw new AppError("password does not matched", 400);

    const hash = await hashPassword(new_password);

    user.password = hash;

    await user.save();

    sendResponse(res, {
      message: "password updated",
      data: null,
      statusCode: 200,
    });
  },
);

//* forgot password

//* change email

//* update profile image
