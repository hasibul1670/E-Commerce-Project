import express from "express";
import { UserController } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", UserController.getUsersData);
userRouter.get("/:id", UserController.getUserById);
userRouter.delete("/:id", UserController.deleteUserById);
userRouter.post("/process-register", UserController.processRegister);
userRouter.post("/verify", UserController.activateUserAccount);
export default userRouter;
