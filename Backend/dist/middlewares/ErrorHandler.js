"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = __importDefault(require("../utils/Response"));
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const Error_1 = require("../interface/Error");
const logger_1 = __importDefault(require("../config/logger"));
class ErrorHandler {
    // Catch Error
    static CaptureError(fn) {
        return async (req, res, next) => {
            try {
                fn(req, res, next);
            }
            catch (error) {
                console.log("capture error");
                next(error);
            }
        };
    }
    // Handle Error
    static async HandleError(error, req, res, next) {
        logger_1.default.warn(error.logMessage + " " + JSON.stringify(error));
        delete error.logMessage;
        error.stack && delete error.stack;
        //Database known error
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code == "P2025") {
            return Response_1.default.sendError(res, "Missing input data", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        // Database incorrect data
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            return Response_1.default.sendError(res, "Incorrect input data", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        // Custom Error Handling
        if (error.type) {
            if (error.type === Error_1.ErrorType.VALIDATION) {
                if (Array.isArray(error.errors)) {
                    // Form Validation Error
                    return Response_1.default.sendError(res, http_status_codes_1.ReasonPhrases.BAD_REQUEST, http_status_codes_1.StatusCodes.BAD_REQUEST, { ...error, errors: ErrorHandler.formErrorFormat(error.errors), message: error.message });
                }
                // Other Validation Error
                return Response_1.default.sendError(res, http_status_codes_1.ReasonPhrases.BAD_REQUEST, http_status_codes_1.StatusCodes.BAD_REQUEST, error);
            }
            if (error.type === Error_1.ErrorType.SESSION) {
                // Expired or Invalid Token (401)
                return Response_1.default.sendError(res, http_status_codes_1.ReasonPhrases.UNAUTHORIZED, http_status_codes_1.StatusCodes.UNAUTHORIZED, error);
            }
            // User authorized (403)
            if (error.type === Error_1.ErrorType.UNAUTHORIZED) {
                return Response_1.default.sendError(res, http_status_codes_1.ReasonPhrases.FORBIDDEN, http_status_codes_1.StatusCodes.FORBIDDEN, error);
            }
            // Resource traget not found
            if (error.type === Error_1.ErrorType.NO_RESOURCE) {
                return Response_1.default.sendError(res, http_status_codes_1.ReasonPhrases.NOT_FOUND, http_status_codes_1.StatusCodes.NOT_FOUND, error);
            }
        }
        // Unknown Error
        return Response_1.default.sendError(res, "Something went wrong", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
    /**
     * Formatting form validation error array value
     * @param errors : array of form validation error field
     */
    static formErrorFormat(errors) {
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
exports.default = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map