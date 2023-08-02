import { Request, Response, NextFunction } from "express";
import ExpressFn from "../interface/ExpressFunc";
import prisma from "../config/database";
import ResponseUtils from "../utils/Response";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { Error } from "../..";
import { ErrorType, ServerError } from "../interface/Error";
import logger from "../config/logger";
import { FieldValidationError, ValidationError } from "express-validator";
export default class ErrorHandler {
  // Catch Error
  static CaptureError(fn: ExpressFn) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        fn(req, res, next);
      } catch (error) {
        console.log("capture error");
        next(error);
      }
    };
  }

  // Handle Error
  static async HandleError(
    error: ServerError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.warn(error.logMessage+" "+ JSON.stringify(error));
    delete error.logMessage;
    error.stack && delete error.stack

    //Database known error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code == "P2025"
    ) {
      return ResponseUtils.sendError(
        res,
        "Missing input data",
        StatusCodes.BAD_REQUEST
      );
    }

    // Database incorrect data
    if (error instanceof Prisma.PrismaClientValidationError) {
      return ResponseUtils.sendError(
        res,
        "Incorrect input data",
        StatusCodes.BAD_REQUEST
      );
    }

    // Custom Error Handling
    if (error.type) {
      if (error.type === ErrorType.VALIDATION) {
        if (Array.isArray(error.errors)) {
          // Form Validation Error
          return ResponseUtils.sendError(
            res,
            ReasonPhrases.BAD_REQUEST,
            StatusCodes.BAD_REQUEST,
            { ...error, errors: ErrorHandler.formErrorFormat(error.errors),message: error.message }
          );
        }

        // Other Validation Error
        return ResponseUtils.sendError(
          res,
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          error
        );
      }

      if (error.type === ErrorType.SESSION) {
        // Expired or Invalid Token (401)
        return ResponseUtils.sendError(
          res,
          ReasonPhrases.UNAUTHORIZED,
          StatusCodes.UNAUTHORIZED,
          error
        );
      }

      // User authorized (403)
      if (error.type === ErrorType.UNAUTHORIZED) {
        return ResponseUtils.sendError(
          res,
          ReasonPhrases.FORBIDDEN,
          StatusCodes.FORBIDDEN,
          error
        );
      }

      // Resource traget not found

      if (error.type === ErrorType.NO_RESOURCE) {
        return ResponseUtils.sendError(
          res,
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
          error
        );
      }
    }

    // Unknown Error
    return ResponseUtils.sendError(
      res,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }

  /**
   * Formatting form validation error array value
   * @param errors : array of form validation error field
   */
  static formErrorFormat(errors: FieldValidationError[]) {
    return errors.map((error) => {
      const format = {
        value: error.value,
        field: error.path,
        message: error.msg,
        type: error.type,
      };
      return format;
    });
  }
}
