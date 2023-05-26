import { Response } from "express";

export const errorResponse = (res: Response, { statusCode = 500, message = "Internal Server Error" }) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};


export const successResponse = (res: Response, { statusCode = 200, message = "Success",payload={} }) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    payload,
  });
};

