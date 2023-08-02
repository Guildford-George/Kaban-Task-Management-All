import logger from "../config/logger";
import { Response } from "express";

export default class ResponseUtils {
  // Sucessful response
  static sendSuccess<T>(
    res: Response,
    message: string,
    code: number,
    data: T | null = null
  ) {
    return res
      .status(code)
      .json({ status: "success", code, message, time: new Date(), data });
  }

  //   Error Response
  static sendError<T>(
    res: Response,
    message: string,
    code: number,
    error: T | null = null
  ) {
    return res
      .status(code)
      .json({ status: "error", code, message, time: new Date(), error });
  }
}
