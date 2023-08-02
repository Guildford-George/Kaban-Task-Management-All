import { NextFunction, Request, Response } from "express";
import ResponseUtils from "../utils/Response";
import { ERRORMESSAGE, LOGGERMESSAGE } from "../constant/message";
import { ErrorType, ServerError } from "../interface/Error";
import CustomError from "../utils/CustomError";
import {
  validateAccessToken,
  validateRefreshToken,
} from "../utils/GeneralUtils";
import { JwtPayload } from "jsonwebtoken";
import ThrowError from "../utils/CustomError";

const { unauthenticated, unauthorized, sessionEnded } = ERRORMESSAGE;
const { unauthenticatedUser, unauthorizedUser, userSessionEnded } =
  LOGGERMESSAGE;
export class Authorization {
  /**
   * Validate AccessToken
   *
   */
  static async AccessTokenVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authorization = req.headers.authorization;
      
      if (!authorization) {
        // Bearer Token not provided
        ThrowError(ErrorType.SESSION, unauthenticated,unauthenticatedUser)
      }

      const token = authorization?.split(" ")[1];
      
      if (!token) {
        // Bearer was provide but with no token
        ThrowError(ErrorType.SESSION, unauthenticated,unauthenticatedUser)
      }
      const { loginId, role, tokenType } = <JwtPayload>validateAccessToken(token as string);
      req.payload = {
        loginId,
        role,
        tokenType,
      };
      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate AccessToken
   *
   */
  static async RefreshTokenSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const refreshToken = req.cookies.USER_AUTH_REFRESH_TOKEN;
      if (!refreshToken) {
        ThrowError(ErrorType.SESSION, sessionEnded,userSessionEnded)
      }

      const { loginId, role, tokenType } = <JwtPayload>validateRefreshToken(refreshToken);
      req.payload = {
        loginId,
        role,
        tokenType,
      };
      next();
    } catch (error) {
      next(error);
    }
  }

}
