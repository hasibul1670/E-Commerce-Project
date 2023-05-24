import express from "express";
import seedUser from "../controllers/seedController";

export const seedRouter = express.Router();
seedRouter.get("/users",seedUser)