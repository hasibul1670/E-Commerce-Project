import createError from "http-errors";
import { User } from "../models/usermodel";

export const checkUserExists = async (email: any) => {
  try {
    console.log("Hello", email);
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, "User with this Email already exists!");
    }
  } catch (error) {
    throw createError(419, "An error occurred while checking user existence");
  }
};
