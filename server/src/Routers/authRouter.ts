import express from "express";
import { authController } from "../controllers/authController";
import { isLoggedIn, isLoggedOut } from "../middlewares/auth";

const authRouter = express.Router();

authRouter.post("/login", isLoggedOut, authController.handleLogin);
authRouter.post("/logout", isLoggedIn, authController.handleLogout);

export default authRouter;
