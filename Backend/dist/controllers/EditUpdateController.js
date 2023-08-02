"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("../interface/Error");
const DatabasePrivilege_1 = require("../utils/DatabasePrivilege");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const database_1 = __importDefault(require("../config/database"));
const message_1 = require("../constant/message");
const Response_1 = __importDefault(require("../utils/Response"));
const http_status_codes_1 = require("http-status-codes");
const ValidationSchema_1 = require("../utils/ValidationSchema");
const GeneralUtils_1 = require("../utils/GeneralUtils");
const Move_1 = require("../utils/Move");
const { invalidColumnName, duplicateColumnName, invalidBoardTarget, emptyBoardName, editBoardDuplicateColumnNames, invalidTaskTarget, invalidSubtaskTarget, } = message_1.ERRORMESSAGE;
const { unsuccessfulColumnNameChange, unsuccessfulUpdateBoard, unsuccessfulUpdateTask, unsuccessfulUpdateDoneStatus, } = message_1.LOGGERMESSAGE;
const { updateColumnName, successfulBoardEdit, successfulTaskEdit, successfulDoneEdit, } = message_1.SUCCESSMESSAGE;
class EditUpdateController {
    /**
     *  Edit Column Name
     */
    static async EditColumnName(req, res, next) {
        try {
            const { columnId } = req.params;
            const name = req.params.name.trim();
            const { loginId } = req.payload;
            // Validate Column Target
            const findColumn = await (0, DatabasePrivilege_1.TargetUserColumn)(loginId, columnId);
            if (!findColumn) {
                (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, invalidColumnName, unsuccessfulColumnNameChange);
                return;
            }
            if (!name || /^[A-Za-z][A-Za-z0-9]{3,}$/.test(name)) {
                (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, invalidColumnName, unsuccessfulColumnNameChange);
            }
            // Check  for existing name
            const findDuplicateName = await database_1.default.column.findFirst({
                where: {
                    columnName: {
                        search: name,
                        mode: "insensitive",
                    },
                    AND: {
                        NOT: {
                            columnId,
                        },
                    },
                },
            });
            if (findDuplicateName !== null) {
                (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, duplicateColumnName, unsuccessfulColumnNameChange);
            }
            // Update target column name
            const updateColumnname = await database_1.default.column.update({
                data: {
                    columnName: name,
                },
                where: {
                    columnId,
                },
            });
            const { boardId, boardName, columns } = findColumn;
            const response = {
                boardId,
                boardName,
                column: {
                    columnId: columns[0].columnId,
                    columnName: name,
                    itemOrder: columns[0].itemOrder,
                },
            };
            Response_1.default.sendSuccess(res, updateColumnName, http_status_codes_1.StatusCodes.CREATED, {
                item: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Edit Board
     *
     */
    static async EditBoard(req, res, next) {
        try {
            const { boardId } = req.params;
            const { loginId } = req.payload;
            const findTargetBoard = await (0, DatabasePrivilege_1.TargetUserBoard)(loginId, boardId);
            if (!findTargetBoard) {
                (0, CustomError_1.default)(Error_1.ErrorType.NO_RESOURCE, invalidBoardTarget, unsuccessfulUpdateBoard);
            }
            await (0, ValidationSchema_1.editBoardSchemaValidation)(req);
            const savedColumns = req.body.savedColumns;
            const newColumns = req.body.newColumns;
            let invalidName = [];
            let validName = [];
            let avaliableColumnName = [];
            //   Check for invalid column name for already saved column
            savedColumns.forEach((column, index) => {
                if (column.columnName &&
                    /[A-Za-z][A-Za-z0-9]{3,}/.test(column.columnName)) {
                    validName.push(column);
                    avaliableColumnName.push(column.columnName);
                }
                else {
                    invalidName.push(index);
                }
            });
            if (newColumns.length > 0) {
                // Check for invalid column name for newly added columns
                newColumns.forEach((column, index) => {
                    if (/[A-Za-z][A-Za-z0-9]{3,}/.test(column)) {
                        avaliableColumnName.push(column);
                    }
                    else if (column) {
                        invalidName.push(savedColumns.length + index);
                    }
                });
            }
            if (invalidName.length > 0) {
                (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, editBoardDuplicateColumnNames, unsuccessfulUpdateBoard, { invalidField: invalidName });
            }
            (0, GeneralUtils_1.duplicationColumnNameFromRequest)(avaliableColumnName);
            //   Update saved Column
            await Promise.all(validName.map(async (column) => {
                return await database_1.default.column.update({
                    data: {
                        columnName: column.columnName,
                    },
                    where: {
                        columnId: column.columnId,
                    },
                });
            }));
            const { deletedColumns } = req.body;
            let numberOfDeletedColumns = 0;
            if (deletedColumns.length > 0) {
                const allDeletedColumn = await Promise.all(deletedColumns.map(async (column) => {
                    const singleDelete = await database_1.default.column.delete({
                        where: {
                            columnId: column,
                        },
                        select: {
                            itemOrder: true,
                        },
                    });
                    // update column order
                    await database_1.default.column.updateMany({
                        where: {
                            itemOrder: {
                                gt: singleDelete.itemOrder,
                            },
                        },
                        data: {
                            itemOrder: {
                                decrement: 1,
                            },
                        },
                    });
                }));
                numberOfDeletedColumns = allDeletedColumn.length;
            }
            //   Update board name
            const { name } = req.body;
            const newBoardInfo = await database_1.default.board.update({
                where: {
                    boardId,
                },
                data: {
                    boardName: name,
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
                    },
                },
            });
            const response = {
                ...newBoardInfo,
                numberOfDeletedColumns,
            };
            Response_1.default.sendSuccess(res, successfulBoardEdit, http_status_codes_1.StatusCodes.CREATED, {
                item: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Edit Task
     *
     */
    static async EditTask(req, res, next) {
        try {
            const { loginId } = req.payload;
            const { taskId } = req.params;
            const findTask = await (0, DatabasePrivilege_1.TargetUserTask)(loginId, taskId);
            if (!findTask) {
                (0, CustomError_1.default)(Error_1.ErrorType.NO_RESOURCE, invalidTaskTarget, unsuccessfulUpdateTask);
                return;
            }
            await (0, ValidationSchema_1.taskSchemaValidation)(req);
            const { savedSubtasks } = req.body;
            (0, GeneralUtils_1.validateEmptySavedSubtask)(savedSubtasks);
            const { deletedSubtasks } = req.body;
            let numberOfDeleteSubtasks = 0;
            if (deletedSubtasks.length > 0) {
                const subtasksDeleteRequest = await database_1.default.subtask.deleteMany({
                    where: {
                        subtaskId: {
                            in: deletedSubtasks,
                        },
                    },
                });
                numberOfDeleteSubtasks = subtasksDeleteRequest.count;
            }
            const { title, description, newSubtasks, columnId } = req.body;
            const createManyNewSubtasks = newSubtasks.map((sub) => ({
                title: sub,
            }));
            await database_1.default.task.update({
                where: {
                    taskId,
                },
                data: {
                    title,
                    description,
                    subtasks: {
                        createMany: {
                            data: createManyNewSubtasks,
                        },
                    },
                },
            });
            await Promise.all(savedSubtasks.map(async (sub) => {
                return await database_1.default.subtask.update({
                    data: {
                        title: sub.title,
                    },
                    where: {
                        subtaskId: sub.subtaskId,
                    },
                });
            }));
            const moveTaskData = {
                destination: { columnId: columnId, index: 0, taskId },
                source: {
                    columnId: findTask.columns[0].columnId,
                    index: findTask.columns[0].itemOrder,
                    taskId,
                },
            };
            const moveResponse = await (0, Move_1.MoveTaskHorizontally)(moveTaskData);
            return Response_1.default.sendSuccess(res, successfulTaskEdit, http_status_codes_1.StatusCodes.OK, { items: Response_1.default });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update Subtask done status
     */
    static async UpdateSubtaskDone(req, res, next) {
        try {
            const { loginId } = req.payload;
            const { subtaskId } = req.params;
            const findSubtask = await (0, DatabasePrivilege_1.TargetUserSubtask)(loginId, subtaskId);
            if (!findSubtask) {
                (0, CustomError_1.default)(Error_1.ErrorType.NO_RESOURCE, invalidSubtaskTarget, unsuccessfulUpdateDoneStatus);
                return;
            }
            const { done } = req.body;
            const response = await database_1.default.subtask.update({
                where: {
                    subtaskId,
                },
                data: {
                    done,
                },
                select: {
                    subtaskId: true,
                    title: true,
                    done: true,
                },
            });
            return Response_1.default.sendSuccess(res, successfulDoneEdit, http_status_codes_1.StatusCodes.CREATED, { item: response });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = EditUpdateController;
//# sourceMappingURL=EditUpdateController.js.map