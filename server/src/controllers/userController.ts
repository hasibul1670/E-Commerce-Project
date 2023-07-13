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
var bcrypt = require("bcryptjs");

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
const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    console.log("Hello", payload);
    const isExist = await User.findById(id);

    if (!isExist) {
      throw new createError(StatusCodes.NOT_FOUND, "User not found 146!");
    }

    const result = await User.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return successResponse(res, {
      statusCode: 200,
      message: " User Updated Successfully  ",
      payload: {
        result,
      },
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

    const image = req.file;

    if (!image) {
      throw createError(400, "Image File Is Required");
    }
    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "File Size exceeds 2MB");
    }

    const imageBufferString = req.file?.buffer.toString("base64");

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        StatusCodes.CONFLICT,
        "User with this Email already exists!"
      );
    }

    const token = JsonWebToken.createJWT(
      { name, email, password, phone, address, image: imageBufferString },
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
      await sendEmailWithNodemailer(emailData);
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

const banUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const isExist = await User.findById(id);

    if (!isExist) {
      throw new createError(StatusCodes.NOT_FOUND, "User not found !");
    }

    const payload = { isBanned: true };

    const result = await User.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return successResponse(res, {
      statusCode: 200,
      message: " User is Banned Successfully  ",
      payload: {
        result,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const userId = req.params.id;

    const user = await findWithId(User, userId);

    //check password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createHttpError(401, " Old Password is not match");
    }
    const filter = { userId };
    const update = { $set: { password: newPassword } };
    const updateOption = { new: true };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOption
    ).select("-password");
    return successResponse(res, {
      statusCode: 200,
      message: " User is password Updated Successfully  ",
      payload: { updateUser },
    });
  } catch (err) {
    next(err);
  }
};

const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createHttpError(404, "User not found!! Please Sign Up!");
    }

    const token = JsonWebToken.createJWT(
      { email },
      config.jwtResetPasswordKey,
      "10h"
    );
    //prepare Email
    const emailData = {
      email,
      subject: "Reset Password  Email",
      html: ` 
<h2>Hello ${userData?.name}!</h2>
<p>Please Click here to <a href=${config.clientURL}/api/users/reset-password/${token} target="_blank">
 Reset your Password</a>
 </p>
`,
    };

    try {
      await sendEmailWithNodemailer(emailData);
    } catch (error) {
      new createError(500, "Failed to send Reset Password email");
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: ` Please ! Check your ${email} to Reset Password `,
      payload: { token },
    });
  } catch (err) {
    next(err);
  }
};




const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, config.jwtResetPasswordKey) as JwtPayload;

    if (!decoded) {
      throw createHttpError(400, "Invalid /Expired token");
    }
    const filter = { email: decoded.email };
    const update = { password: password };
    const options = { new: true };

    const updateUser = await User.findOneAndUpdate(
      filter,
      update,
      options
    ).select("-passwod");

    if (!updateUser) {
      throw createHttpError(400,'Password Reset Failed');
    } 
    return successResponse(res, {
      statusCode: 200,
      message: " User  password Reset Successfully  ",
      payload: {updateUser},
    });
  } catch (err) {
    next(err);
  }
};

export const UserController = {
  processRegister,
  forgetPassword,
  resetPassword,
  activateUserAccount,
  deleteUserById,
  getUserById,
  getUsersData,
  updatePassword,
  updateUserById,
  banUserById,
};
