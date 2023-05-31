import createHttpError from "http-errors";
import mongoose from "mongoose";
import { User } from "../models/usermodel";

export const findWithId= async (id: string,options={}) => {
  try {

    const item = await User.findById(id, options);

    if (!item) {
      throw createHttpError(404, "Item doesn't exist with this Id");
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, "Invalid User ID");
    }
    throw error;
  }
};
