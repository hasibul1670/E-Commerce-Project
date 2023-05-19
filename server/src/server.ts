import express, { Express, Request, Response } from "express";
var morgan = require("morgan");

const app: Express = express();

app.use(morgan("dev"));
app.get("/products", (req: Request, res: Response) => {
  res.send("Products are available");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to ourdfgdgfg Server");
});

app.delete("/test", (req: Request, res: Response) => {
  res.send(" delete: Welcome to the Test Server 1997");
});

app.listen(4000, () => {
  console.log("Server is running at http://localhost:4000");
});
