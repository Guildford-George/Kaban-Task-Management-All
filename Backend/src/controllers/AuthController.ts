import { Request, Response, NextFunction } from "express";
import { loginSchmenValidation } from "../utils/ValidationSchema";
import prisma from "../config/database";
import {
  ERRORMESSAGE,
  LOGGERMESSAGE,
  SUCCESSMESSAGE,
} from "../constant/message";
import { ErrorType, ServerError } from "../interface/Error";
import { error } from "winston";
import CustomError from "../utils/CustomError";
import {
  generateAccessToken,
  generateRefreshToken,
  validatePassword,
} from "../utils/GeneralUtils";
import { Payload } from "../interface/GeneralInterface";
import config from "../config/config";
import ResponseUtils from "../utils/Response";
import { StatusCodes } from "http-status-codes";
import ThrowError from "../utils/CustomError";

const { invalidAccount, unmatchPassword } = ERRORMESSAGE;
const { unsuccessfulLogin } = LOGGERMESSAGE;
const { sucessfulLogin,succesfulaccountVerification } = SUCCESSMESSAGE;

export default class AuthController {
  /**
   * Login of user
   *
   * @param req Express Request Object
   * @param res Express Response Object
   */
  static async Login(req: Request, res: Response, next: NextFunction) {
    try {
      await loginSchmenValidation(req);

      const { email, password } = req.body;

      const account = await prisma.account.findFirst({
        where: {
          email,
        },
      });

      if (account === null) {
        // Account not found
        ThrowError(ErrorType.VALIDATION, invalidAccount, unsuccessfulLogin);
        return;
      }

      const match = await validatePassword(password, account.password);
      if (!match) {
        // Invalid Password
        ThrowError(ErrorType.VALIDATION, unmatchPassword, unsuccessfulLogin);
      }

      const { loginId, role } = account;
      const user = await prisma.user.findFirst({
        where: {
          loginId,
        },
      });

      // Generate Session Token
      const tokenType = <string>config?.AUTHH_TOKEN_TYPE_NAME;
      const payload: Payload = {
        loginId,
        role,
        tokenType,
      };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      // Save refresh in cookie
      const refreshTokenLocationName = <string>config?.AUTH_REFRESH_TOKEN_NAME;
      const maxAge = config?.REFRESH_TOKEN_MAXAGE;
      res.cookie(refreshTokenLocationName, refreshToken, {
        httpOnly: true,
        maxAge,
        sameSite: "none",
      });

      const response = {
        user: {
          loginId,
          email: account.email,
          firstaname: user?.firstname,
          lastname: user?.lastname,
          role: account.role,
        },
        token: accessToken,
      };
      return ResponseUtils.sendSuccess(
        res,
        sucessfulLogin,
        StatusCodes.CREATED,
        response
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  /**
   * Login of user
   *
   * @param req Express Request Object
   * @param res Express Response Object
   */
  static Reset(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  static async ReAuth(req:Request, res:Response, next:NextFunction){
    try {
      const {loginId,role}= req.payload
      const user= await prisma.account.findFirst({
        where: {
          loginId
        },
        select:{
          loginId:true,
          email: true,
          user:{
            select:{
              firstname: true,
              lastname: true,
            }
          }
        }
      })

      const response ={
        user:{
          loginId,
          email: user?.email,
          firstname: user?.user?.firstname,
          lastname: user?.user?.lastname,
          role
        }
      }

      ResponseUtils.sendSuccess(res,succesfulaccountVerification,StatusCodes.CREATED,response)
    } catch (error) {
      next(error)
    }
  }

  static RefreshAccessToken(req: Request, res: Response, next: NextFunction){
    try {
      const token = generateAccessToken(req.payload);
      const response = {
        token,
      };
      return ResponseUtils.sendSuccess(
        res,
        SUCCESSMESSAGE.successfulaccessTokenRefreshed,
        StatusCodes.CREATED,
        response
      );
    } catch (error) {
      next(error);
    }
  };
}
