import bodyParser from "body-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import createHttpError from "http-errors";
import { seedRouter } from "./routers/seedRouter";
import userRouter from "./routers/userRouter";
import { errorResponse } from "./controllers/responseConroller";
var morgan = require("morgan");

const xssClean = require("xss-clean");

const app: Express = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP. Please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//user router
app.use("/api/user", userRouter);
app.use("/api/seed", seedRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to ourdfgdgfg Server");
});

//client error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, "Route not found !!  404"));
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

app.use((err: CustomError, req: Request, res: Response, next: NextFunction): any => {
    return errorResponse(res,{
      statusCode: err.status,
      message: err.message 
    })
  }
);

module.exports = app;
