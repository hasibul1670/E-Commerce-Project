import express from "express";
import { authController } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/login", authController.handleLogin);

export default authRouter;
