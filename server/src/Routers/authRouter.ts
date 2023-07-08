import express from "express";
import { authController } from "../controllers/authController";
import { isLoggedIn, isLoggedOut } from "../middlewares/auth";
import { runValidation } from "../validators";
import { Validation } from "../validators/auth";

const authRouter = express.Router();

authRouter.post(
  "/login",
  Validation.validateUserLogin,
  runValidation,
  isLoggedOut,
  authController.handleLogin
);
authRouter.post("/logout", isLoggedIn, authController.handleLogout);

export default authRouter;
