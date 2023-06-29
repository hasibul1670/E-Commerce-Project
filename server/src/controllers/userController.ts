import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { JsonWebToken } from "../helper/JsonWebToken";
import { deleteImage } from "../helper/deleteImage";
import sendEmailWithNodemailer from "../helper/email";
import { User } from "../models/usermodel";
import { findWithId } from "../services/findItem";
import { successResponse } from "./responseConroller";
var createError = require("http-errors");

const getUsersData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //seach variables
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    //filter
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (users.length === 0) {
      new createError(404, "No users found 146");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User were Return Successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: (page + 1) << Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "Individual User were Returned Successfully",
      payload: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const options = { passwod: 0 };
    const foundedUserById = await findWithId(User, id, options);

    const userImagePath = foundedUserById.image;
    deleteImage(userImagePath);

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: " User was Deleted Successfully  ",
    });
  } catch (err) {
    next(err);
  }
};

const processRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        StatusCodes.CONFLICT,
        "User with this Email already exists!"
      );
    }

    const token = JsonWebToken.createJWT(
      { name, email, password, phone, address },
      config.jwtActivationKey,
      "10h"
    );
    //prepare Email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: ` 
  <h2>Hello ${name}!</h2>
  <p>Please Click here to <a href=${config.clientURL}/api/users/activate/${token} target="_blank">
   activate your Account</a>
   </p>
  `,
    };
    try {
     // await sendEmailWithNodemailer(emailData);
    } catch (error) {
      new createError(500, "Failed to send verification email");
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: ` Please ! Check your ${email} for verification`,
      payload: { token },
    });
  } catch (err) {
    next(err);
  }
};

const activateUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.body.token;
    if (!token) {
      next(createHttpError(404, "token not found"));
    }

    try {
      const decoded = jwt.verify(token, config.jwtActivationKey) as JwtPayload;
      if (!decoded) {
        throw createError(StatusCodes.UNAUTHORIZED, "User not able to Verify");
      }
      console.log("Hello", decoded);

      const userExist = await User.findOne({ email: decoded?.email });
      try {
        if (userExist?.email === decoded?.email) {
          throw createError(409, "User with this Email already exists!");
        }
      } catch (error) {
        next(error);
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: `User was registered successfully`,
      });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw createError(StatusCodes.UNAUTHORIZED, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(StatusCodes.UNAUTHORIZED, "This Token is Invalid");
      }
    }
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  processRegister,
  activateUserAccount,
  deleteUserById,
  getUserById,
  getUsersData,
};
