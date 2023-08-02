import { Request, Response, NextFunction } from "express";

type ExpressFn= (req:Request, res:Response, next:NextFunction)=>void

export default ExpressFn