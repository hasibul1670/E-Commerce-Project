import createHttpError from "http-errors";
import mongoose from "mongoose";
import { User } from "../models/usermodel";

export const findUserById = async (id: string) => {
  try {
    const option = { password: 0 };
    const user = await User.findById(id, option);

    if (!user) {
      throw createHttpError(404, "User doesn't exist with this Id");
    }
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, "Invalid User ID");
    }
    throw error;
  }
};
