import cookieParser from "cookie-parser";

import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "./controllers/responseConroller";
import authRouter from "./routers/authRouter";
import seedRouter from "./routers/seedRouter";
import userRouter from "./routers/userRouter";
var morgan = require("morgan");

const xssClean = require("xss-clean");

const app: Application = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP. Please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(limiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//user router
app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);
app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to ECOM 2023 Server");
});

//client error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(
    createHttpError(StatusCodes.NOT_FOUND, "This Route is not found !!  404")
  );
});

//Server error handlers--> all the error handlers
class CustomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

app.use(
  (err: CustomError, req: Request, res: Response, next: NextFunction): any => {
    return errorResponse(res, {
      statusCode: err.status,
      message: err.message,
    });
  }
);

export default app;
