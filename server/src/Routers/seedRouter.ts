import express from "express";
import seedUser from "../controllers/seedController";

const seedRouter = express.Router();

seedRouter.get("/in",seedUser)

export default seedRouter;