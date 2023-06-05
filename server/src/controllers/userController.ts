import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { JsonWebToken } from "../helper/JsonWebToken";
import { deleteImage } from "../helper/deleteImage";
import { User } from "../models/usermodel";
import { jwtActivationKey } from "../secret";
import { findWithId } from "../services/findItem";
import { successResponse } from "./responseConroller";

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
      throw createHttpError(404, "No users found 146");
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
      throw createHttpError(409, "User with this Email already exists");
    }
    const token = JsonWebToken.createJWT(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    const newUser = {
      name,
      email,
      password,
      phone,
      address,
    };

    return successResponse(res, {
      statusCode: 200,
      message: " User was Deleted Successfully  ",
      payload: { token },
    });
  } catch (err) {
    next(err);
  }
};

export const UserController = {
  processRegister,
  deleteUserById,
  getUserById,
  getUsersData,
};
