
import express, { Express, NextFunction, Request, Response } from "express";
import { deleteUser, getUser, getUsersData } from "../controllers/userController";
const userRouter = express.Router();

//GET : api/users
userRouter.get("/",getUsersData);
userRouter.get("/:id",getUser);
userRouter.delete("/:id",deleteUser);

export default userRouter;