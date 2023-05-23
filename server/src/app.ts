import bodyParser from "body-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
var morgan = require("morgan");
import createError = require("http-errors");
import userRouter from './routers/userRouter';
const xssClean= require("xss-clean");


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
//user routrer
app.use( "/api/user",userRouter);

app.get("/products", (req: Request, res: Response) => {
  res.send("Products are available");
});
app.post("/test", (req: Request, res: Response) => {
  res.send("Api test is available");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to ourdfgdgfg Server");
  
});

//client error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, "Route not found !!  404"));
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
    return res.status(err.status || 500).json({
      status: err.status,
      success: false,
      message: err.message,
    });
  }
);

module.exports = app;
