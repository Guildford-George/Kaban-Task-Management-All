"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationSchema_1 = require("../utils/ValidationSchema");
const database_1 = __importDefault(require("../config/database"));
const message_1 = require("../constant/message");
const Error_1 = require("../interface/Error");
const GeneralUtils_1 = require("../utils/GeneralUtils");
const Response_1 = __importDefault(require("../utils/Response"));
const http_status_codes_1 = require("http-status-codes");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const DatabasePrivilege_1 = require("../utils/DatabasePrivilege");
const { duplicationBoardName, invalidColumn, invalidColumnsData, invalidBoardTarget, duplicateColumnName, invalidTaskTarget, duplicationColumnNames } = message_1.ERRORMESSAGE;
const { successfulNewBoard, successfulNewTask, getUserBoards, getBoardColumn, createNewColumn, taskDeleted, boardDeleted, columnDeleted, } = message_1.SUCCESSMESSAGE;
const { unsuccessfullNewBoard, unsuccessfullNewTask, unsuccessfulNewColumn, unsucessfulDeleteTask, unsucessfulDeleteBoard, unsuccessfulFetchSingle, unsucessfulDeleteColumn, } = message_1.LOGGERMESSAGE;
class UserController {
    /**
     * Adding new Board
     *
     */
    static async AddBoard(req, res, next) {
        try {
            // Validation request body data
            await (0, ValidationSchema_1.addBoardSchemaValidation)(req);
            const { loginId } = req.payload;
            const { name } = req.body;
            const searchDupplicateName = await database_1.default.board.findFirst({
                where: {
                    createdBy: loginId,
                    boardName: {
                        search: name,
                    },
                },
            });
            if (searchDupplicateName !== null) {
                //   Duplication board name
                (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, duplicationBoardName, unsuccessfullNewBoard);
            }
            const { columns } = req.body;
            if (columns && Array.isArray(columns)) {
                let filteredEmptyName = columns.filter((col) => col.length > 0);
                if (filteredEmptyName.length > 0) {
                    // Create board with columns
                    (0, GeneralUtils_1.duplicationColumnNameFromRequest)(filteredEmptyName);
                    (0, GeneralUtils_1.validateColumnName)(filteredEmptyName);
                    let formatColumn = filteredEmptyName.map((col, index) => ({
                        columnName: col,
                        itemOrder: index,
                    }));
                    const dbData = {
                        board: {
                            boardName: name,
                            createdBy: loginId,
                        },
                        columns: formatColumn,
                    };
                    const databaseResponse = await (0, GeneralUtils_1.relationalTableSaveBoard)(dbData);
                    return Response_1.default.sendSuccess(res, successfulNewBoard, http_status_codes_1.StatusCodes.CREATED, {
                        item: databaseResponse,
                    });
                }
                // Create board with no column
                const boardWithNoColumns = await database_1.default.board.create({
                    data: {
                        boardName: name,
                        createdBy: loginId,
                    },
                    select: {
                        boardName: true,
                        createdAt: true,
                        columns: true,
                    },
                });
                return Response_1.default.sendSuccess(res, successfulNewBoard, http_status_codes_1.StatusCodes.CREATED, {
                    item: boardWithNoColumns,
                });
            }
            // Invalid Columns Data
            (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, invalidColumnsData, unsuccessfullNewBoard);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Add new task
     *
     */
    static async AddTask(req, res, next) {
        try {
            // Validate columnId
            const { columnId, name } = req.body;
            const { loginId } = req.payload;
            const checkColumn = await (0, DatabasePrivilege_1.TargetUserColumn)(loginId, columnId);
            if (!checkColumn) {
                (0, CustomError_1.default)(Error_1.ErrorType.NO_RESOURCE, invalidColumn, unsuccessfullNewTask);
            }
            // Validation request body data
            await (0, ValidationSchema_1.taskSchemaValidation)(req);
            // Validation Subtasks
            const { subtasks } = req.body;
            if (subtasks && Array.isArray(subtasks)) {
                // Remove empty subtasks field
                const filteredEmptyName = subtasks.filter((subtask) => subtask.length > 0);
                if (filteredEmptyName.length > 0) {
                    const formatSubtasks = filteredEmptyName.map((subtask) => ({ title: subtask }));
                    // Increase order of task in a column by 1 and save new data with order of 0
                    await database_1.default.task.updateMany({
                        where: {
                            columnId,
                        },
                        data: {
                            itemOrder: {
                                increment: 1,
                            },
                        },
                    });
                    const dbData = {
                        task: {
                            title: name,
                            description: req.body.description ? req.body.description : "",
                            itemOrder: 0,
                        },
                        subtasks: formatSubtasks,
                    };
                    const response = await (0, GeneralUtils_1.relationalTableSaveTask)(dbData, columnId);
                    return Response_1.default.sendSuccess(res, successfulNewTask, http_status_codes_1.StatusCodes.CREATED, { item: response });
                }
                // Save new task with no subtasks
                await database_1.default.task.updateMany({
                    where: {
                        columnId,
                    },
                    data: {
                        itemOrder: {
                            increment: 1,
                        },
                    },
                });
                const response = await database_1.default.task.create({
                    data: {
                        title: name,
                        description: req.body.description ? req.body.description : "",
                        itemOrder: 0,
                        columnId,
                    },
                    select: {
                        title: true,
                        description: true,
                        itemOrder: true,
                        subtasks: true,
                    },
                });
                return Response_1.default.sendSuccess(res, successfulNewTask, http_status_codes_1.StatusCodes.CREATED, { item: response });
            }
            // Invalid Subtasks field Data
            (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, invalidColumnsData, unsuccessfullNewBoard);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Add new column
     */
    static async AddColumn(req, res, next) {
        try {
            const { boardId } = req.params;
            const { loginId } = req.payload;
            const { name } = req.body;
            const findBoard = await (0, DatabasePrivilege_1.TargetUserBoard)(loginId, boardId);
            if (!findBoard) {
                (0, CustomError_1.default)(Error_1.ErrorType.NO_RESOURCE, invalidBoardTarget, unsuccessfulNewColumn);
                return;
            }
            // Search already existing column name
            const searchduplicateColumnName = await database_1.default.column.findFirst({
                where: {
                    boardId,
                    columnName: {
                        search: name,
                        mode: "insensitive",
                    },
                },
            });
            if (searchduplicateColumnName !== null) {
                (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, duplicateColumnName, unsuccessfulNewColumn);
            }
            const numberOfColumns = await database_1.default.column.count({
                where: {
                    boardId,
                },
            });
            const saveNewColumn = await database_1.default.column.create({
                data: {
                    columnName: name,
                    boardId,
                    itemOrder: numberOfColumns,
                },
            });
            const response = {
                boardId,
                boardName: findBoard.boardName,
                column: {
                    columnId: saveNewColumn.columnId,
                    columnName: saveNewColumn.columnName,
                    itemOrder: saveNewColumn.itemOrder,
                },
            };
            Response_1.default.sendSuccess(res, createNewColumn, http_status_codes_1.StatusCodes.CREATED, {
                item: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Fetch list of boards
     *
     */
    static async GetBoards(req, res, next) {
        try {
            const { loginId } = req.payload;
            const response = await database_1.default.board.findMany({
                where: {
                    createdBy: loginId,
                },
                select: {
                    boardId: true,
                    boardName: true,
                    createdAt: true,
                },
            });
            return Response_1.default.sendSuccess(res, getUserBoards, http_status_codes_1.StatusCodes.OK, {
                items: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Fetch list of Columns
     *
     */
    static async GetColumns(req, res, next) {
        try {
            const { boardId } = req.params;
            const { loginId } = req.payload;
            const boardTarget = await (0, DatabasePrivilege_1.TargetUserBoard)(loginId, boardId);
            if (!boardTarget) {
                (0, CustomError_1.default)(Error_1.ErrorType.NO_RESOURCE, invalidColumn, unsuccessfulFetchSingle);
            }
            const response = await database_1.default.board.findFirst({
                where: {
                    boardId,
                },
                select: {
                    boardId: true,
                    boardName: true,
                    columns: {
                        select: {
                            columnId: true,
                            columnName: true,
                            itemOrder: true,
                        },
                        orderBy: {
                            itemOrder: "asc",
                        },
                    },
                },
            });
            if (response === null) {
                return Response_1.default.sendError(res, invalidBoardTarget, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            Response_1.default.sendSuccess(res, getBoardColumn, http_status_codes_1.StatusCodes.OK, {
                item: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete a user board
     *
     */
    static async DeleteBoard(req, res, next) {
        try {
            const { loginId } = req.payload;
            const { boardId } = req.params;
            const boardTarget = await (0, DatabasePrivilege_1.TargetUserBoard)(loginId, boardId);
            if (!boardTarget) {
                (0, CustomError_1.default)(Error_1.ErrorType.NO_RESOURCE, invalidBoardTarget, unsucessfulDeleteBoard);
            }
            await database_1.default.board.delete({
                where: {
                    boardId,
                },
            });
            return Response_1.default.sendSuccess(res, boardDeleted, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            next(error);
        }
    }
    static async DeleteColumn(req, res, next) {
        try {
            const { columnId } = req.params;
            const { loginId } = req.params;
            const columnTarget = (0, DatabasePrivilege_1.TargetUserColumn)(loginId, columnId);
            if (!columnTarget) {
                (0, CustomError_1.default)(Error_1.ErrorType.NO_RESOURCE, invalidColumn, unsucessfulDeleteColumn);
            }
            await database_1.default.column.delete({
                where: {
                    columnId,
                },
            });
            return Response_1.default.sendError(res, columnDeleted, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete a task from a column
     */
    static async DeleteTask(req, res, next) {
        try {
            const { taskId } = req.params;
            const { loginId } = req.payload;
            const findOwner = await (0, DatabasePrivilege_1.TargetUserTask)(loginId, taskId);
            if (!findOwner) {
                (0, CustomError_1.default)(Error_1.ErrorType.NO_RESOURCE, invalidTaskTarget, unsucessfulDeleteTask);
                return;
            }
            // Delete target task
            const deleteTargetTask = await database_1.default.task.delete({
                where: {
                    taskId,
                },
                select: {
                    itemOrder: true,
                },
            });
            // Restructure the order of task in the column
            await database_1.default.task.updateMany({
                where: {
                    columnId: findOwner.columns[0].columnId,
                    itemOrder: {
                        gt: deleteTargetTask.itemOrder,
                    },
                },
                data: {
                    itemOrder: {
                        decrement: 1,
                    },
                },
            });
            Response_1.default.sendSuccess(res, taskDeleted, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map