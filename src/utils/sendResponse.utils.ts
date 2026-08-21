import { Response } from "express";

type IResponseData<T> = {
  statusCode: number;
  message: string;
  data: T;
};

const sendResponse = <T>(
  res: Response,
  { statusCode, message, data }: IResponseData<T>,
) => {
  res.status(statusCode).json({
    message,
    data,
    success: true,
    status: "success",
  });
};

export default sendResponse;