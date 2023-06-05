import express from "express";
import { UserController } from "../controllers/userController";

const userRouter = express.Router();

//GET : api/users
userRouter.get("/", UserController.getUsersData);
userRouter.get("/:id", UserController.getUserById);
userRouter.delete("/:id", UserController.deleteUserById);
userRouter.post("/process-register", UserController.processRegister);

export default userRouter;
