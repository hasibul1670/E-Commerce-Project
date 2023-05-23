import { NextFunction, Request, Response } from "express";
import { usersData } from "../models/usermodel";
import createError = require("http-errors");



export const getUsersData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send({
      message: "Get USer data available",
      user: usersData,
    });
  } catch (err) {
    next(err);

  }
};
