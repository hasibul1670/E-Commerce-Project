
import express, { Express, NextFunction, Request, Response } from "express";
import { getUser, getUsersData } from "../controllers/userController";
const userRouter = express.Router();

//GET : api/users
userRouter.get("/",getUsersData);
userRouter.get("/:id",getUser);

export default userRouter;