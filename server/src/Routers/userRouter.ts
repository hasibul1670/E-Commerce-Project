import express from "express";

import { UserController } from "../controllers/userController";

import { isAdmin, isLoggedIn, isLoggedOut } from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import { runValidation } from "../validators";
import { Validation } from "../validators/auth";

const userRouter = express.Router();

userRouter.patch(
  "/reset-password",
  Validation.validateUserResetPassword,
  runValidation,
  UserController.resetPassword
);

userRouter.get("/", isLoggedIn, isAdmin, UserController.getUsersData);
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
userRouter.patch(
  "/ban-user/:id",
  isLoggedIn,
  isAdmin,
  UserController.banUserById
);

userRouter.patch(
  "/update-password/:id",
  isLoggedIn,
  UserController.updatePassword
);
userRouter.post(
  "/forget-password",
  Validation.validateUserForgetPassword,
  runValidation,
  UserController.forgetPassword
);

export default userRouter;
