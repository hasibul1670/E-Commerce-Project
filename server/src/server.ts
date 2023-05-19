import bodyParser from "body-parser";
import express, { Express, NextFunction, Request, Response } from "express";
var morgan = require("morgan");

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const login: boolean = true;
  if (login) {
    req.body.id = 101;
    next();
  } else {
    return res.status(401).json({ message: "please Login First" });
  }
};

app.get("/api/user", isLoggedIn, (req: Request, res: Response) => {
  res.send("User Profile is available " + "Id : " + req.body.id);
});

app.get("/products", (req: Request, res: Response) => {
  res.send("Products are available");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to ourdfgdgfg Server");
});

//client error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: " Route not found" });
  next();
});


//Server error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction):void => {
  console.error(err); // Log the error object to the console
  res.status(500).send('Something broke!'); // Send a 500 status code and "Something broke!" message as the response
});

app.listen(4000, () => {
  console.log("Server is running at http://localhost:4000");
});
