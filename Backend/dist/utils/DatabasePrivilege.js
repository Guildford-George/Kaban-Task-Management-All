"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetUserSubtask = exports.TargetUserTask = exports.TargetUserColumn = exports.TargetUserBoard = void 0;
const database_1 = __importDefault(require("../config/database"));
const TargetUserBoard = async (loginId, boardId) => {
    try {
        const board = await database_1.default.board.findFirst({
            where: {
                createdBy: loginId,
                boardId,
            },
        });
        if (board === null) {
            return false;
        }
        return board;
    }
    catch (error) {
        throw error;
    }
};
exports.TargetUserBoard = TargetUserBoard;
const TargetUserColumn = async (loginId, columnId) => {
    try {
        const column = await database_1.default.board.findFirst({
            where: {
                createdBy: loginId,
            },
            select: {
                boardId: true,
                boardName: true,
                createdAt: true,
                columns: {
                    where: {
                        columnId,
                    },
                    select: {
                        columnId: true,
                        columnName: true,
                        itemOrder: true,
                    },
                },
            },
        });
        if (column === null) {
            return false;
        }
        return column;
    }
    catch (error) {
        throw error;
    }
};
exports.TargetUserColumn = TargetUserColumn;
const TargetUserTask = async (loginId, taskId) => {
    try {
        const task = await database_1.default.board.findFirst({
            where: {
                createdAt: loginId,
            },
            select: {
                boardId: true,
                boardName: true,
                createdAt: true,
                columns: {
                    select: {
                        columnId: true,
                        columnName: true,
                        itemOrder: true,
                        tasks: {
                            select: {
                                taskId: true,
                                title: true,
                                itemOrder: true
                            },
                            where: {
                                taskId
                            }
                        }
                    },
                },
            },
        });
        if (task === null) {
            return false;
        }
        return task;
    }
    catch (error) {
        throw error;
    }
};
exports.TargetUserTask = TargetUserTask;
const TargetUserSubtask = async (loginId, subtaskId) => {
    try {
        const subtask = await database_1.default.board.findFirst({
            where: {
                createdAt: loginId,
            },
            select: {
                boardId: true,
                boardName: true,
                createdAt: true,
                columns: {
                    select: {
                        columnId: true,
                        columnName: true,
                        itemOrder: true,
                        tasks: {
                            select: {
                                taskId: true,
                                title: true,
                                itemOrder: true,
                                subtasks: {
                                    select: {
                                        subtaskId: true,
                                        title: true,
                                        done: true
                                    },
                                    where: {
                                        subtaskId
                                    }
                                }
                            },
                        }
                    },
                },
            },
        });
        if (subtask === null) {
            return false;
        }
        return subtask;
    }
    catch (error) {
        throw error;
    }
};
exports.TargetUserSubtask = TargetUserSubtask;
//# sourceMappingURL=DatabasePrivilege.js.map