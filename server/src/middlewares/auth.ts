import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw createHttpError(401, "Access token not Found!! Please login");
    }
    const decoded = jwt.verify(token, config.jwtAccessKey) as JwtPayload;

    if (!decoded) {
      throw createHttpError(401, "Access token Invalid");
    }

    req.body.userId = decoded._id;

    next();
  } catch (error) {
    return next(error);
  }
};

export const isLoggedOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      throw createHttpError(400, "User is Already logged In");
    }

    next();
  } catch (error) {
    return next(error);
  }
};
