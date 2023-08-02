import { Request, Response, NextFunction } from "express";
import ResponseUtils from "./Response";
import { StatusCodes } from "http-status-codes";
const serverHealth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const message= "Server is live"
  return ResponseUtils.sendSuccess(res, message, StatusCodes.OK);
};

export default serverHealth;
