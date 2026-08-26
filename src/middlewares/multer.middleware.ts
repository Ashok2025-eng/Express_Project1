import { Request } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import AppError from "../utils/appError.utils";

const multerFileUploader = () => {
  //* Multer

  const folder = "uploads/";
  const maxFileSize = 5 * 1024 * 1024;
  const allowedExts = [".png", ".jpg", ".svg", ".jpeg", ".webp"];
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/svg",
    "image/jpeg",
    "image/webp",
  ];

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  //* disk storage
  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      cb(null, folder);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const fileName = Date.now() + "_" + file.originalname;
      cb(null, fileName);
    },
  });

  //* file filter
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (!allowedExts.includes(path.extname(file.originalname).toLowerCase())) {
      const message = `invalid file extension.Only ${allowedExts.join(",")} are created`;
      cb(new AppError(message, 400));
      return;
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      const message = `invalid file extension.Only ${allowedExts.join(",")} are created`;
      cb(new AppError(message, 400));
      return;
    }
    cb(null, true);
  };

  //* multer upload instance
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: maxFileSize,
    },
  });
  return upload;
};

export default multerFileUploader;
