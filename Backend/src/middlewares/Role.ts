import { NextFunction, Request, Response } from "express";
import { ERRORMESSAGE, LOGGERMESSAGE } from "../constant/message";
import { ErrorType, ServerError } from "../interface/Error";
import CustomError from "../utils/CustomError";
import prisma from "../config/database";
import { Role } from "../interface/GeneralInterface";
import ThrowError from "../utils/CustomError";

const { unauthorized } = ERRORMESSAGE;
const { unauthorizedUser } = LOGGERMESSAGE;
export class RoleAuthorization {
  static Verify(AccoutRole: "USER" | "ADMIN") {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { loginId, role, tokenType } = req.payload;

        if (!loginId || !role || !tokenType) {
          ThrowError(ErrorType.UNAUTHORIZED, unauthorized, unauthorizedUser);
        }

        //   Check for valid loginId
        const account = await prisma.account.findFirst({
          where: {
            loginId,
            role: AccoutRole,
          },
          select:{
            loginId:true,
            email: true,
          }
        });
        if (account === null) {
          ThrowError(ErrorType.UNAUTHORIZED, unauthorized, unauthorizedUser);
          return
        }
        req.account={
          ...account,
          role

        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
