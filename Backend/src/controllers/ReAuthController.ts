import { Request, Response, NextFunction } from "express";
import { generateAccessToken } from "../utils/GeneralUtils";
import ResponseUtils from "../utils/Response";
import { SUCCESSMESSAGE } from "../constant/message";
import { StatusCodes } from "http-status-codes";

/**
 * Refresh Access Token
 */
const refreshAccessToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = generateAccessToken(req.payload);
    const { loginId, role } = req.payload;
    const response = {
      token,
    };
    return ResponseUtils.sendSuccess(
      res,
      SUCCESSMESSAGE.successfulaccessTokenRefreshed,
      StatusCodes.CREATED,
      {
        item: response,
      }
    );
  } catch (error) {
    next(error);
  }
};

export default refreshAccessToken