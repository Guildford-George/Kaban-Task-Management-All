"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveTaskHorizontally = exports.MoveTaskVertically = void 0;
const database_1 = __importDefault(require("../config/database"));
const MoveTaskVertically = async (moveTaskData) => {
    const { destination, source } = moveTaskData;
    if (destination.columnId === source.columnId &&
        destination.index !== source.index) {
        if (source.index > destination.index) {
            // Move Up
            await database_1.default.task.updateMany({
                where: {
                    columnId: source.columnId,
                    itemOrder: {
                        lt: source.index,
                        gte: destination.index,
                    },
                },
                data: {
                    itemOrder: {
                        increment: 1,
                    },
                },
            });
        }
        else {
            // Move Down
            await database_1.default.task.updateMany({
                where: {
                    columnId: source.columnId,
                    itemOrder: {
                        gt: source.index,
                        lte: destination.index,
                    },
                },
                data: {
                    itemOrder: {
                        decrement: 1,
                    },
                },
            });
        }
        await database_1.default.task.update({
            where: {
                taskId: destination.taskId,
            },
            data: {
                itemOrder: destination.index,
            },
        });
        const moveResponse = await database_1.default.column.findFirst({
            where: {
                columnId: source.columnId,
            },
        });
        return { source: moveResponse, destination: moveResponse };
    }
};
exports.MoveTaskVertically = MoveTaskVertically;
const MoveTaskHorizontally = async (moveTaskData) => {
    const { destination, source } = moveTaskData;
    const totalDestinationTasks = await database_1.default.task.count({
        where: {
            columnId: destination.columnId,
        },
    });
    const totalSourceTasks = await database_1.default.task.count({
        where: {
            columnId: source.columnId,
        },
    });
    if (destination.index <= totalDestinationTasks + 1 &&
        source.index <= totalSourceTasks) {
        await database_1.default.$transaction([
            // update order of destination
            database_1.default.task.updateMany({
                where: {
                    columnId: destination.columnId,
                    itemOrder: {
                        gte: destination.index,
                    },
                },
                data: {
                    itemOrder: {
                        increment: 1,
                    },
                },
            }),
            // update order of source
            database_1.default.task.updateMany({
                data: {
                    itemOrder: {
                        decrement: 1,
                    },
                },
                where: {
                    columnId: source.columnId,
                    itemOrder: {
                        gt: source.index,
                    },
                },
            }),
        ]);
        const moveResponse = await database_1.default.$transaction([
            // updated source
            database_1.default.column.findFirst({
                where: {
                    columnId: source.columnId,
                },
                select: {
                    columnId: true,
                    columnName: true,
                    tasks: {
                        select: {
                            taskId: true,
                            title: true,
                            description: true,
                            subtasks: {
                                select: {
                                    subtaskId: true,
                                    title: true,
                                    done: true,
                                },
                            },
                        },
                    },
                },
            }),
            // updated destination
            database_1.default.column.findFirst({
                where: {
                    columnId: destination.columnId,
                },
                select: {
                    columnId: true,
                    columnName: true,
                    tasks: {
                        select: {
                            taskId: true,
                            title: true,
                            description: true,
                            subtasks: {
                                select: {
                                    subtaskId: true,
                                    title: true,
                                    done: true,
                                },
                            },
                        },
                    },
                },
            }),
        ]);
        return { source: moveResponse[0], destination: moveResponse[1] };
    }
};
exports.MoveTaskHorizontally = MoveTaskHorizontally;
//# sourceMappingURL=Move.js.map