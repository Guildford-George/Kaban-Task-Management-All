import createError from "custom-error-generator";
import { ErrorType, MultiNameError, ServerError } from "../interface/Error";
import { FieldValidationError } from "express-validator";

const CustomError = (message: string, errorData: Object) => {
  const error = createError(message, errorData);
  const newError = new error(message);
  return newError;
};

const ThrowError = (
  type: "VALIDATION" | "SESSION" | "UNAUTHORIZED" | "NO_RESOURCE",
  message: string,
  logMessage: string,
  errors: FieldValidationError[] | MultiNameError | null=null
) => {
  const customeErrorObj: ServerError = {
    message,
    type,
    logMessage,
    errors,
  };

  const error = CustomError(message, customeErrorObj);
  throw error;
};

export default ThrowError
