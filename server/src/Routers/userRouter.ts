import express from "express";

import { UserController } from "../controllers/userController";

import { isLoggedIn, isLoggedOut } from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import { runValidation } from "../validators";
import { Validation } from "../validators/auth";

const userRouter = express.Router();

userRouter.get("/", isLoggedIn, UserController.getUsersData);
userRouter.get("/:id", isLoggedIn, UserController.getUserById);
userRouter.delete("/:id", isLoggedIn, UserController.deleteUserById);
userRouter.patch("/:id", isLoggedIn, UserController.updateUserById);
userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  Validation.validateUserRegistration,
  runValidation,
  UserController.processRegister
);
userRouter.post("/verify", isLoggedOut, UserController.activateUserAccount);

export default userRouter;
