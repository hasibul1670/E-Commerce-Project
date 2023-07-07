import { NextFunction, Request, Response } from "express";
var bcrypt = require("bcryptjs");

import createHttpError from "http-errors";
import config from "../config";
import { JsonWebToken } from "../helper/JsonWebToken";
import { User } from "./../models/usermodel";
import { successResponse } from "./responseConroller";

const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    //isExist
    const user = await User.findOne({ email: email });

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    //check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createHttpError(401, "Password  is not match");
    }

    //isBanned??
    if (user.isBanned) {
      throw createHttpError(403, "User is banned !! Please Contact to Admin");
    }

    //generate token
    const accessToken = JsonWebToken.createJWT(
      { _id: user._id },
      config.jwtAccessKey,
      "10h"
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });
    //success
    return successResponse(res, {
      statusCode: 200,
      message: `User Logged in Successfully!!`,
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};
const handleLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("accessToken");

    return successResponse(res, {
      statusCode: 200,
      message: `User Log out in Successfully!!`,
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  handleLogin,
  handleLogout,
};
