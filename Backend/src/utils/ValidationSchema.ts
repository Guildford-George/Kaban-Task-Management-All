import { Request } from "express";
import { checkSchema, validationResult } from "express-validator";
import { ERRORMESSAGE, LOGGERMESSAGE } from "../constant/message";
import CustomError from "./CustomError";
import { ErrorType } from "../interface/Error";
import prisma from "../config/database";
import ThrowError from "./CustomError";

const {
  invalidEmail,
  emptyEmail,
  emptyPassword,
  weakPassword,
  loginError,
  invalidBoardName,
  invalidInput,
  emptyBoardName,
  invalidTaskName,
  emptyTaskName,
  duplicationTaskName,
  duplicationBoardName,
  addBoardError,
  addTaskError,
  editBoardError,
  invalidColumName,
  addColumnError,
  emptyColumnName,
} = ERRORMESSAGE;

const {
  unsuccessfulLogin,
  unsuccessfullNewBoard,
  unsuccessfullNewTask,
  unsuccessfulUpdateBoard,
  unsuccessfulNewColumn,
} = LOGGERMESSAGE;

/**
 * Thrown error if the request body has invalid field data
 *
 * @param req Request object for validation request body
 */
export const loginSchmenValidation = async (req: Request) => {
  await checkSchema(
    {
      email: {
        exists: {
          errorMessage: emptyEmail,
          bail: true,
        },
        trim: true,
        escape: true,
        isEmail: {
          errorMessage: invalidEmail,
        },
      },
      password: {
        exists: {
          errorMessage: emptyPassword,
          bail: true,
        },
        trim: true,
        escape: true,
        isStrongPassword: {
          options: {
            minLength: 8,
            minSymbols: 1,
            minUppercase: 1,
          },
          errorMessage: weakPassword,
        },
      },
    },
    ["body"]
  ).run(req);

  customSchemeErrorHanlder(req, loginError, unsuccessfulLogin);
};

/**
 *
 * Validation form for creating new board
 */
export const addBoardSchemaValidation = async (req: Request) => {
  await checkSchema(
    {
      name: {
        exists: {
          errorMessage: emptyBoardName,
          bail: true,
        },
        trim: true,
        escape: true,
        isString: {
          errorMessage: invalidBoardName,
        },
        matches: {
          options: /^[A-Za-z]{1}[A-Za-z0-9]{2,}$/,
          errorMessage: invalidBoardName,
          bail: true,
        },
      },
    },
    ["body"]
  ).run(req);

  customSchemeErrorHanlder(req, addBoardError, unsuccessfullNewBoard);
};

/**
 *
 * Validation form for creating new board
 */
export const addColumSchemaValidation = async (req: Request) => {
  await checkSchema(
    {
      name: {
        exists: {
          errorMessage: emptyColumnName,
          bail: true,
        },
        trim: true,
        escape: true,
        isString: {
          errorMessage: invalidColumName,
        },
        matches: {
          options: /^[A-Za-z]{1}[A-Za-z0-9]{2,}$/,
          errorMessage: invalidColumName,
          bail: true,
        },
      },
    },
    ["body"]
  ).run(req);

  customSchemeErrorHanlder(req, addColumnError, unsuccessfulNewColumn);
};
/**
 *
 * Validation form for creating new task
 */
export const taskSchemaValidation = async (req: Request) => {
  const { columnId } = req.body;

  await checkSchema(
    {
      title: {
        exists: {
          errorMessage: emptyTaskName,
          bail: true,
        },
        trim: true,
        escape: true,

        isString: {
          errorMessage: invalidTaskName,
          bail: true,
        },
        matches: {
          options: /^[A-Za-z]{1}[A-Za-z0-9]{2,}$/,
          errorMessage: invalidTaskName,
          bail: true,
        },
        custom: {
          options: async (value) => {
           return DuplicationField.TaskName(value, columnId);
          },
        },
      },
      description: {
        trim: true,
        escape: true,
      },
    },
    ["body"]
  ).run(req);

  customSchemeErrorHanlder(req, addTaskError, unsuccessfullNewTask);
};

export const editBoardSchemaValidation = async (req: Request) => {
  const { loginId } = req.payload;
  const { boardId } = req.params;
  await checkSchema(
    {
      name: {
        exists: {
          errorMessage: emptyBoardName,
          bail: true,
        },
        trim: true,
        escape: true,
        isString: {
          errorMessage: invalidBoardName,
          bail: true,
        },
        matches: {
          options: /^[A-Za-z]{1}[A-Za-z0-9]{2,}$/,
          errorMessage: invalidBoardName,
          bail: true,
        },
      },
    },
    ["body"]
  ).run(req);

  customSchemeErrorHanlder(req, editBoardError, unsuccessfulUpdateBoard);
};

class DuplicationField {
  /**
   * Check for an already existing task name
   *
   * @param value Task name
   * @param columnId Column target
   */
  static async TaskName(value: string, columnId: string) {
    const findDuplicateTaskName = await prisma.task.findFirst({
      where: {
        columnId,
        title: {
          search: value,
          mode: "insensitive",
        },
      },
      select:{
        taskId:true,
      }
    });
    if (findDuplicateTaskName !== null) {
      throw new Error(duplicationTaskName);
    }
  }

  static async BoardName(value: string, loginId: string, boardId: string) {
    const findDuplicateBoardName = await prisma.board.findFirst({
      where: {
        createdBy: loginId,
        boardId,
        boardName: {
          search: value,
          mode: "insensitive",
        },
      },
    });
    if (findDuplicateBoardName !== null) {
      throw new Error(duplicationBoardName);
    }
  }
}

/**
 *
 *Handle form validation error
 */
export const customSchemeErrorHanlder = (
  req: Request,
  message: string,
  logMessage: string
) => {
  const result = validationResult(req);

  result.array();
  //   Check for error
  if (!result.isEmpty()) {
    ThrowError(
      ErrorType.VALIDATION,
      message,
      logMessage,
      result.array() as any
    );
  }
};
