"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customSchemeErrorHanlder = exports.editBoardSchemaValidation = exports.taskSchemaValidation = exports.addBoardSchemaValidation = exports.loginSchmenValidation = void 0;
const express_validator_1 = require("express-validator");
const message_1 = require("../constant/message");
const Error_1 = require("../interface/Error");
const database_1 = __importDefault(require("../config/database"));
const CustomError_1 = __importDefault(require("./CustomError"));
const { invalidEmail, emptyEmail, emptyPassword, weakPassword, loginError, invalidBoardName, invalidInput, emptyBoardName, invalidTaskName, emptyTaskName, duplicationTaskName, duplicationBoardName, addBoardError, addTaskError, editBoardError, } = message_1.ERRORMESSAGE;
const { unsuccessfulLogin, unsuccessfullNewBoard, unsuccessfullNewTask, unsuccessfulUpdateBoard, } = message_1.LOGGERMESSAGE;
/**
 * Thrown error if the request body has invalid field data
 *
 * @param req Request object for validation request body
 */
const loginSchmenValidation = async (req) => {
    await (0, express_validator_1.checkSchema)({
        email: {
            exists: {
                errorMessage: emptyEmail,
                bail: true,
            },
            trim: true,
            escape: true,
            // isEmpty: {
            //   errorMessage: emptyEmail,
            //   bail: true,
            // },
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
            // isEmpty: {
            //   errorMessage: emptyPassword,
            //   bail: true,
            // },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minSymbols: 1,
                    minUppercase: 1,
                },
                errorMessage: weakPassword,
            },
        },
    }, ["body"]).run(req);
    (0, exports.customSchemeErrorHanlder)(req, loginError, unsuccessfulLogin);
};
exports.loginSchmenValidation = loginSchmenValidation;
/**
 *
 * Validation form for creating new board
 */
const addBoardSchemaValidation = async (req) => {
    await (0, express_validator_1.checkSchema)({
        name: {
            exists: {
                errorMessage: emptyBoardName,
                bail: true,
            },
            trim: true,
            escape: true,
            isEmpty: {
                errorMessage: emptyBoardName,
                bail: true,
            },
            isString: {
                errorMessage: invalidBoardName,
            },
        },
    }, ["body"]).run(req);
    (0, exports.customSchemeErrorHanlder)(req, addBoardError, unsuccessfullNewBoard);
};
exports.addBoardSchemaValidation = addBoardSchemaValidation;
/**
 *
 * Validation form for creating new task
 */
const taskSchemaValidation = async (req) => {
    const { columnId } = req.body;
    await (0, express_validator_1.checkSchema)({
        title: {
            exists: {
                errorMessage: emptyTaskName,
                bail: true,
            },
            trim: true,
            escape: true,
            isEmpty: {
                errorMessage: emptyTaskName,
                bail: true,
            },
            isString: {
                errorMessage: invalidTaskName,
                bail: true,
            },
            custom: {
                options: async (value) => {
                    DuplicationField.TaskName(value, columnId);
                },
            },
        },
        description: {
            trim: true,
            escape: true,
        },
    }, ["body"]).run(req);
    (0, exports.customSchemeErrorHanlder)(req, addTaskError, unsuccessfullNewTask);
};
exports.taskSchemaValidation = taskSchemaValidation;
const editBoardSchemaValidation = async (req) => {
    const { loginId } = req.payload;
    const { boardId } = req.params;
    await (0, express_validator_1.checkSchema)({
        name: {
            exists: {
                errorMessage: emptyBoardName,
                bail: true,
            },
            trim: true,
            escape: true,
            isEmpty: {
                errorMessage: emptyBoardName,
                bail: true,
            },
            isString: {
                errorMessage: invalidBoardName,
                bail: true,
            },
            custom: {
                options: async (value) => {
                    await DuplicationField.BoardName(value, loginId, boardId);
                },
            },
        },
    }, ["body"]).run(req);
    (0, exports.customSchemeErrorHanlder)(req, editBoardError, unsuccessfulUpdateBoard);
};
exports.editBoardSchemaValidation = editBoardSchemaValidation;
class DuplicationField {
    /**
     * Check for an already existing task name
     *
     * @param value Task name
     * @param columnId Column target
     */
    static async TaskName(value, columnId) {
        const findDuplicateTaskName = await database_1.default.task.findFirst({
            where: {
                columnId,
                title: {
                    search: value,
                    mode: "insensitive",
                },
            },
        });
        if (findDuplicateTaskName !== null) {
            throw new Error(duplicationTaskName);
        }
    }
    static async BoardName(value, loginId, boardId) {
        const findDuplicateBoardName = await database_1.default.board.findFirst({
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
const customSchemeErrorHanlder = (req, message, logMessage) => {
    const result = (0, express_validator_1.validationResult)(req);
    result.array();
    //   Check for error
    if (!result.isEmpty()) {
        (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, loginError, unsuccessfulLogin, result.array());
    }
};
exports.customSchemeErrorHanlder = customSchemeErrorHanlder;
//# sourceMappingURL=ValidationSchema.js.map