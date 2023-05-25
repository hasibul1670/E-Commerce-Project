
import express, { Express, NextFunction, Request, Response } from "express";
import { getUsersData } from "../controllers/userController";
const userRouter = express.Router();

//GET : api/users
userRouter.get("/",getUsersData);

export default userRouter;