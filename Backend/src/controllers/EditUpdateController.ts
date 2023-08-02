import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../interface/Error";
import {
  TargetUserBoard,
  TargetUserColumn,
  TargetUserSubtask,
  TargetUserTask,
} from "../utils/DatabasePrivilege";
import ThrowError from "../utils/CustomError";
import prisma from "../config/database";
import {
  ERRORMESSAGE,
  LOGGERMESSAGE,
  SUCCESSMESSAGE,
} from "../constant/message";
import ResponseUtils from "../utils/Response";
import { StatusCodes } from "http-status-codes";
import {
  editBoardSchemaValidation,
  taskSchemaValidation,
} from "../utils/ValidationSchema";
import {
  duplicationColumnNameFromRequest,
  validateEmptySavedSubtask,
} from "../utils/GeneralUtils";
import { MoveTaskHorizontally } from "../utils/Move";

const {
  invalidColumnName,
  duplicateColumnName,
  invalidBoardTarget,
  emptyBoardName,
  editBoardDuplicateColumnNames,
  invalidTaskTarget,
  invalidSubtaskTarget,
} = ERRORMESSAGE;
const {
  unsuccessfulColumnNameChange,
  unsuccessfulUpdateBoard,
  unsuccessfulUpdateTask,
  unsuccessfulUpdateDoneStatus,
} = LOGGERMESSAGE;
const {
  updateColumnName,
  successfulBoardEdit,
  successfulTaskEdit,
  successfulDoneEdit,
} = SUCCESSMESSAGE;
export default class UserEditUpdateController {
  /**
   * Edit Board
   *
   */
  static async EditBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const { boardId } = req.params;
      const { loginId } = req.payload;
      const findTargetBoard = await TargetUserBoard(loginId, boardId);
      if (!findTargetBoard) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidBoardTarget,
          unsuccessfulUpdateBoard
        );
      }

      await editBoardSchemaValidation(req);

      const savedColumns: { columnId: string; columnName: string }[] =
        req.body.savedColumns;
      const newColumns: string[] = req.body.newColumns;

      let invalidName: number[] = [];
      let validName: { columnId: string; columnName: string }[] = [];
      let avaliableColumnName: string[] = [];

      //   Check for invalid column name for already saved column
      savedColumns.forEach((column, index) => {
        if (
          column.columnName &&
          /[A-Za-z][A-Za-z0-9]{3,}/.test(column.columnName)
        ) {
          validName.push(column);
          avaliableColumnName.push(column.columnName);
        } else {
          invalidName.push(index);
        }
      });
      if (newColumns.length > 0) {
        // Check for invalid column name for newly added columns
        newColumns.forEach((column, index) => {
          if (/[A-Za-z][A-Za-z0-9]{3,}/.test(column)) {
            avaliableColumnName.push(column);
          } else if (column) {
            invalidName.push(savedColumns.length + index);
          }
        });
      }
      if (invalidName.length > 0) {
        ThrowError(
          ErrorType.VALIDATION,
          editBoardDuplicateColumnNames,
          unsuccessfulUpdateBoard,
          { invalidField: invalidName }
        );
      }

      duplicationColumnNameFromRequest(avaliableColumnName);

      //   Update saved Column
      await Promise.all(
        validName.map(async (column) => {
          return await prisma.column.update({
            data: {
              columnName: column.columnName,
            },
            where: {
              columnId: column.columnId,
            },
          });
        })
      );

      const { deletedColumns } = req.body;
      let numberOfDeletedColumns = 0;
      if (deletedColumns.length > 0) {
        const allDeletedColumn = await Promise.all(
          deletedColumns.map(async (column: string) => {
            const singleDelete = await prisma.column.delete({
              where: {
                columnId: column,
              },
              select: {
                itemOrder: true,
              },
            });

            // update column order
            await prisma.column.updateMany({
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
          })
        );
        numberOfDeletedColumns = allDeletedColumn.length;
      }

      //   Update board name
      const { name } = req.body;
      const newBoardInfo = await prisma.board.update({
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
      ResponseUtils.sendSuccess(res, successfulBoardEdit, StatusCodes.CREATED, {
        item: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *  Edit Column Name
   */
  static async EditColumnName(req: Request, res: Response, next: NextFunction) {
    try {
      const { columnId } = req.params;
      const name = req.params.name.trim();
      const { loginId } = req.payload;

      // Validate Column Target
      const findColumn = await TargetUserColumn(loginId, columnId);
      if (!findColumn) {
        ThrowError(
          ErrorType.VALIDATION,
          invalidColumnName,
          unsuccessfulColumnNameChange
        );
        return;
      }

      if (!name || /^[A-Za-z][A-Za-z0-9]{3,}$/.test(name)) {
        ThrowError(
          ErrorType.VALIDATION,
          invalidColumnName,
          unsuccessfulColumnNameChange
        );
      }

      // Check  for existing name
      const findDuplicateName = await prisma.column.findFirst({
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
        ThrowError(
          ErrorType.VALIDATION,
          duplicateColumnName,
          unsuccessfulColumnNameChange
        );
      }

      // Update target column name
      const updateColumnname = await prisma.column.update({
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
      ResponseUtils.sendSuccess(res, updateColumnName, StatusCodes.CREATED, {
        item: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit Task
   *
   */
  static async EditTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId } = req.payload;
      const { taskId } = req.params;

      const findTask = await TargetUserTask(loginId, taskId);
      if (!findTask) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidTaskTarget,
          unsuccessfulUpdateTask
        );
        return;
      }
      await taskSchemaValidation(req);

      const { savedSubtasks } = req.body;
      validateEmptySavedSubtask(savedSubtasks);

      const { deletedSubtasks } = req.body;
      let numberOfDeleteSubtasks = 0;
      if (deletedSubtasks.length > 0) {
        const subtasksDeleteRequest = await prisma.subtask.deleteMany({
          where: {
            subtaskId: {
              in: deletedSubtasks,
            },
          },
        });
        numberOfDeleteSubtasks = subtasksDeleteRequest.count;
      }
      const { title, description, newSubtasks, columnId } = req.body;

      const createManyNewSubtasks = newSubtasks.map((sub: string) => ({
        title: sub,
      }));
      await prisma.task.update({
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

      await Promise.all(
        savedSubtasks.map(async (sub: { subtaskId: string; title: string }) => {
          return await prisma.subtask.update({
            data: {
              title: sub.title,
            },
            where: {
              subtaskId: sub.subtaskId,
            },
          });
        })
      );
      const moveTaskData = {
        destination: { columnId: columnId, index: 0, taskId },
        source: {
          columnId: findTask.columns[0].columnId,
          index: findTask.columns[0].itemOrder,
          taskId,
        },
      };
      const moveResponse = await MoveTaskHorizontally(moveTaskData);
      return ResponseUtils.sendSuccess(
        res,
        successfulTaskEdit,
        StatusCodes.OK,
        { items: ResponseUtils }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Subtask done status
   */
  static async UpdateSubtaskDone(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { loginId } = req.payload;
      const { subtaskId } = req.params;
      const findSubtask = await TargetUserSubtask(loginId, subtaskId);
      if (!findSubtask) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidSubtaskTarget,
          unsuccessfulUpdateDoneStatus
        );
        return;
      }

      const { done } = req.body;
      const response = await prisma.subtask.update({
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
      return ResponseUtils.sendSuccess(
        res,
        successfulDoneEdit,
        StatusCodes.CREATED,
        { item: response }
      );
    } catch (error) {
      next(error);
    }
  }
}
