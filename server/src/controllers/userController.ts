import { NextFunction, Request, Response } from "express";

import createError = require("http-errors");



export const getUsersData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send({
      message: "Get USer data available",
      
    });
  } catch (err) {
    next(err);

  }
};
