
import express, { Express, NextFunction, Request, Response } from "express";
import {  deleteUserById, getUserById, getUsersData } from "../controllers/userController";
const userRouter = express.Router();

//GET : api/users
userRouter.get("/",getUsersData);
userRouter.get("/:id",getUserById);
userRouter.delete("/:id",deleteUserById);

export default userRouter;