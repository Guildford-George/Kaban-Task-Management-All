import { compare, hash } from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import config from "../config/config";
import {
  BoardAdd,
  Payload,
  RelationalTableSaveBoard,
  RelationalTableSaveTask,
  TaskAdd,
} from "../interface/GeneralInterface";
import { ERRORMESSAGE, LOGGERMESSAGE } from "../constant/message";
import { ErrorType, ServerError } from "../interface/Error";
import CustomError from "./CustomError";
import prisma from "../config/database";
import ThrowError from "./CustomError";

const {
  duplicationColumnNames,
  invalidColumnName,
  invalidToken,
  sessionEnded,
  emptySavedSubtaskField,
} = ERRORMESSAGE;
const {
  unsuccessfullNewBoard,
  unauthorizedUser,
  userSessionEnded,
  unsuccessfulUpdateTask,
} = LOGGERMESSAGE;

/**
 * Returns true/false after verifyinf password
 *
 * @param password provided password
 * @param hashPassword database encrypted password
 * @returns Boolean
 */
export const validatePassword = async (
  password: string,
  hashPassword: string
) => {
  const match = await compare(password, hashPassword);
  return match;
};

/**
 * Hashing of password
 *
 * @param password Password to be encrypted
 * @returns Returns encrypted password
 */
export const encryptPassword = async (password: string) => {
  const salt = <number>config?.SALT;
  const hashPassword = await hash(password, salt);
  return hashPassword;
};

/**
 * Generating of access token
 *
 * @param payload  to generate token
 * @returns access token
 */
export const generateAccessToken = (payload: Payload) => {
  const ACCESS_TOKEN_SECRET = <string>config?.ACCESS_TOKEN_SECRET;
  const ACCESS_TOKEN_DURATION = <string>config?.ACCESS_TOKEN_DURATION;

  const accessToken = sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_DURATION,
  });

  return accessToken;
};

/**
 * Generating of refresh token
 *
 * @param payload  to generate token
 * @returns refresh token
 */
export const generateRefreshToken = (payload: Payload) => {
  const REFRESH_TOKEN_SECRET = <string>config?.REFRESH_TOKEN_SECRET;
  const REFRESH_TOKEN_DURATION = <string>config?.REFRESH_TOKEN_DURATION;

  const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_DURATION,
  });

  return refreshToken;
};

/**
 * Validate AccessToken
 *
 */
export const validateAccessToken = (token: string) => {
  try {
    const ACCESS_TOKEN_SECRET = <string>config?.ACCESS_TOKEN_SECRET;
    const payload = <JwtPayload>verify(token, ACCESS_TOKEN_SECRET);
    return payload;
  } catch (error) {
    ThrowError(ErrorType.UNAUTHORIZED, invalidToken, unauthorizedUser);
  }
};

/**
 * Validate RefreshToken
 *
 */
export const validateRefreshToken = (token: string) => {
  try {
    const REFRESH_TOKEN_SECRET = <string>config?.REFRESH_TOKEN_SECRET;
    const payload = <JwtPayload>verify(token, REFRESH_TOKEN_SECRET);
    return payload;
  } catch (error) {
    ThrowError(ErrorType.UNAUTHORIZED, sessionEnded, userSessionEnded);
  }
};
/**
 * Check for duplicate of data
 *
 * @param nameList List names to be save
 */
export const duplicationColumnNameFromRequest = (nameList: string[]) => {
  const mapper = new Map();
  nameList.forEach((name, index) => {
    const target = name.toLocaleLowerCase();
    if (mapper.has(target)) {
      const value = mapper.get(target);
      value.push(index);
      mapper.set(target, value);
    } else {
      mapper.set(target, [index]);
    }
  });

  let duplicateFields: number[][] = [];
  mapper.forEach((value) => {
    if (value.length > 1) duplicateFields.push(value);
  });
  if (duplicateFields.length) {
    ThrowError(
      ErrorType.VALIDATION,
      duplicationColumnNames,
      unsuccessfullNewBoard,
      { duplicateFields }
    );
  }
};

/**
 * Check for correct name format
 *
 * @param nameList Validate each name
 */
export const validateColumnName = (nameList: string[]) => {
  let invalidField: number[] = [];
  nameList.forEach((name, index) => {
    if (!/^[A-Za-z]{1}[A-Za-z0-9]{2,}$/.test(name)) {
      invalidField.push(index);
    }
  });
  if (invalidField.length > 0) {
    ThrowError(ErrorType.VALIDATION, invalidColumnName, unsuccessfullNewBoard, {
      invalidField,
    });
  }
};

export const validateEmptySavedSubtask = (
  subtasksList: { subtaskId: string; subtaskName: string; done: boolean }[]
) => {
  let invalidSubtasks: number[] = [];
  subtasksList.forEach((subtask, index) => {
    if (!subtask) {
      invalidSubtasks.push(index);
    }
  });
  if (invalidSubtasks.length > 0) {
    ThrowError(
      ErrorType.VALIDATION,
      emptySavedSubtaskField,
      unsuccessfulUpdateTask,
      {invalidField: invalidSubtasks}
    );
  }
};

/**
 * Save New Board with or without columns
 *
 * @param dbData
 * @returns
 */
export const relationalTableSaveBoard = async (
  dbData: RelationalTableSaveBoard
) => {
  const { board, columns } = dbData;

  const saveColumns = {
    createMany: {
      data: [...columns],
    },
  };
  const result = await prisma.board.create({
    data: {
      ...board,
      columns: saveColumns,
    },
    select: {
      boardId: true,
      boardName: true,
      createdBy: true,
      createdAt: true,
      columns: {
        select: {
          columnId: true,
          columnName: true,
          itemOrder: true,
        },
      },
    },
  });
  return result;
};

/**
 * Save New Task with or without subtasks
 *
 * @param dbData
 * @param column targeted column
 * @returns
 */
export const relationalTableSaveTask = async (
  dbData: RelationalTableSaveTask,
  column: string
) => {
  try {
    const { task, subtasks } = dbData;

    const saveSubtasks = {
      createMany: {
        data: subtasks,
      },
    };
    const result = await prisma.task.create({
      data: {
        ...task,
        columnId: column,
        subtasks: saveSubtasks,
      },
      select: {
        taskId: true,
        title: true,
        description: true,
        itemOrder: true,
        createdAt: true,
        subtasks: {
          select: {
            subtaskId: true,
            title: true,
            done: true,
            createdAt: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};
