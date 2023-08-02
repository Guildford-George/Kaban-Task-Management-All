import { FieldValidationError, ValidationError } from "express-validator";

export interface ServerError {
  name?: string;
  stack?: string;
  code?: number;
  logMessage?: string;
  message: string;
  meta?: { target: string[] };
  type?: string;
  errors: FieldValidationError[] | MultiNameError | null;
}

export enum ErrorType {
  VALIDATION = "VALIDATION",
  SESSION = "SESSION",
  UNAUTHORIZED = "UNAUTHORIZED",
  NO_RESOURCE= "NO_RESOURCE"
}

export interface MultiNameError{
  duplicateFields?: number[][];
  invalidField?: number[]
}

