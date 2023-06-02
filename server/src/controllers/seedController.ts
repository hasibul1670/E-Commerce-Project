import { NextFunction, Request, Response } from "express";
import data from "../data";
import { User } from "../models/usermodel";
import { Author } from "../models/authorModel";
const seedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //deleting all existing users
    // await User.deleteMany({});

    //Inserting New User 
    const newUsers = await User.insertMany(data.users);

    //successfully response
    return res.status(201).json(newUsers)

  } catch (err) {
    next(err);
  }
};

export default seedUser;