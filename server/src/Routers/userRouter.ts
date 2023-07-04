import express from "express";

import upload from "../middlewares/uploadFile";
import { runValidation } from "../validators";
import { Validation } from "../validators/auth";
import { UserController } from "../controllers/userController";


const userRouter = express.Router();

userRouter.get("/", UserController.getUsersData);
userRouter.get("/:id", UserController.getUserById);
userRouter.delete("/:id", UserController.deleteUserById);
userRouter.patch("/:id", UserController.updateUserById);
userRouter.post(
  "/process-register",
  upload.single("image"),
  Validation.validateUserRegistration,
  runValidation,
  UserController.processRegister
);
userRouter.post("/verify", UserController.activateUserAccount);



export default userRouter;
