"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationalTableSaveTask = exports.relationalTableSaveBoard = exports.validateEmptySavedSubtask = exports.validateColumnName = exports.duplicationColumnNameFromRequest = exports.validateRefreshToken = exports.validateAccessToken = exports.generateRefreshToken = exports.generateAccessToken = exports.encryptPassword = exports.validatePassword = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config/config"));
const message_1 = require("../constant/message");
const Error_1 = require("../interface/Error");
const database_1 = __importDefault(require("../config/database"));
const CustomError_1 = __importDefault(require("./CustomError"));
const { duplicationColumnNames, invalidColumnName, invalidToken, sessionEnded, emptySavedSubtaskField, } = message_1.ERRORMESSAGE;
const { unsuccessfullNewBoard, unauthorizedUser, userSessionEnded, unsuccessfulUpdateTask, } = message_1.LOGGERMESSAGE;
/**
 * Returns true/false after verifyinf password
 *
 * @param password provided password
 * @param hashPassword database encrypted password
 * @returns Boolean
 */
const validatePassword = async (password, hashPassword) => {
    const match = await (0, bcrypt_1.compare)(password, hashPassword);
    return match;
};
exports.validatePassword = validatePassword;
/**
 * Hashing of password
 *
 * @param password Password to be encrypted
 * @returns Returns encrypted password
 */
const encryptPassword = async (password) => {
    const salt = config_1.default?.SALT;
    const hashPassword = await (0, bcrypt_1.hash)(password, salt);
    return hashPassword;
};
exports.encryptPassword = encryptPassword;
/**
 * Generating of access token
 *
 * @param payload  to generate token
 * @returns access token
 */
const generateAccessToken = (payload) => {
    const ACCESS_TOKEN_SECRET = config_1.default?.ACCESS_TOKEN_SECRET;
    const ACCESS_TOKEN_DURATION = config_1.default?.ACCESS_TOKEN_DURATION;
    const accessToken = (0, jsonwebtoken_1.sign)(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_DURATION,
    });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generating of refresh token
 *
 * @param payload  to generate token
 * @returns refresh token
 */
const generateRefreshToken = (payload) => {
    const REFRESH_TOKEN_SECRET = config_1.default?.REFRESH_TOKEN_SECRET;
    const REFRESH_TOKEN_DURATION = config_1.default?.REFRESH_TOKEN_DURATION;
    const refreshToken = (0, jsonwebtoken_1.sign)(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_DURATION,
    });
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Validate AccessToken
 *
 */
const validateAccessToken = (token) => {
    try {
        const ACCESS_TOKEN_SECRET = config_1.default?.ACCESS_TOKEN_SECRET;
        const payload = (0, jsonwebtoken_1.verify)(token, ACCESS_TOKEN_SECRET);
        return payload;
    }
    catch (error) {
        (0, CustomError_1.default)(Error_1.ErrorType.UNAUTHORIZED, invalidToken, unauthorizedUser);
    }
};
exports.validateAccessToken = validateAccessToken;
/**
 * Validate RefreshToken
 *
 */
const validateRefreshToken = (token) => {
    try {
        const REFRESH_TOKEN_SECRET = config_1.default?.REFRESH_TOKEN_SECRET;
        const payload = (0, jsonwebtoken_1.verify)(token, REFRESH_TOKEN_SECRET);
        return payload;
    }
    catch (error) {
        (0, CustomError_1.default)(Error_1.ErrorType.UNAUTHORIZED, sessionEnded, userSessionEnded);
    }
};
exports.validateRefreshToken = validateRefreshToken;
/**
 * Check for duplicate of data
 *
 * @param nameList List names to be save
 */
const duplicationColumnNameFromRequest = (nameList) => {
    const mapper = new Map();
    nameList.forEach((name, index) => {
        const target = name.toLocaleLowerCase();
        if (mapper.has(target)) {
            const value = mapper.get(name);
            value.push(target);
            mapper.set(target, value);
        }
        else {
            mapper.set(target, [index]);
        }
    });
    let duplicateFields = [];
    mapper.forEach((value) => {
        if (value.length > 1)
            duplicateFields.push(value);
    });
    if (duplicateFields.length) {
        (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, duplicationColumnNames, unsuccessfullNewBoard, { duplicateFields });
    }
};
exports.duplicationColumnNameFromRequest = duplicationColumnNameFromRequest;
/**
 * Check for correct name format
 *
 * @param nameList Validate each name
 */
const validateColumnName = (nameList) => {
    let invalidField = [];
    nameList.forEach((name, index) => {
        if (/^[A-Za-z][A-Za-z0-9]{3,}$/.test(name)) {
            invalidField.push(index);
        }
    });
    if (invalidField.length > 0) {
        (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, invalidColumnName, unsuccessfullNewBoard, {
            invalidField,
        });
    }
};
exports.validateColumnName = validateColumnName;
const validateEmptySavedSubtask = (subtasksList) => {
    let invalidSubtasks = [];
    subtasksList.forEach((subtask, index) => {
        if (!subtask) {
            invalidSubtasks.push(index);
        }
    });
    if (invalidSubtasks.length > 0) {
        (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, emptySavedSubtaskField, unsuccessfulUpdateTask, { invalidField: invalidSubtasks });
    }
};
exports.validateEmptySavedSubtask = validateEmptySavedSubtask;
/**
 * Save New Board with or without columns
 *
 * @param dbData
 * @returns
 */
const relationalTableSaveBoard = async (dbData) => {
    const { board, columns } = dbData;
    const saveColumns = {
        createMany: {
            data: [...columns],
        },
    };
    const result = await database_1.default.board.create({
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
exports.relationalTableSaveBoard = relationalTableSaveBoard;
/**
 * Save New Task with or without subtasks
 *
 * @param dbData
 * @param column targeted column
 * @returns
 */
const relationalTableSaveTask = async (dbData, column) => {
    try {
        const { task, subtasks } = dbData;
        const saveSubtasks = {
            createMany: {
                data: subtasks,
            },
        };
        const result = await database_1.default.task.create({
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
    }
    catch (error) {
        throw error;
    }
};
exports.relationalTableSaveTask = relationalTableSaveTask;
//# sourceMappingURL=GeneralUtils.js.map