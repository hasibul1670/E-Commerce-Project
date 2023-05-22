import { NextFunction, Request, Response } from "express";

const express = require('express');
const userRouter = express.Router();
const usersData = [
    {id:1,name:"John"},
    {id:2,name:"hasib"},
    {id:3,name:"rifat"},
    
    ]
    
 userRouter.get("/api/user", (req: Request, res: Response,next:NextFunction) => {
      res.send({
        message:"Get USer data available",
        user: usersData
      });
      next();
    
    });
    
module.exports = userRouter