import { Request, Response, NextFunction, response } from "express";
import {
  addBoardSchemaValidation,
  addColumSchemaValidation,
  taskSchemaValidation,
} from "../utils/ValidationSchema";
import prisma from "../config/database";
import {
  ERRORMESSAGE,
  LOGGERMESSAGE,
  SUCCESSMESSAGE,
} from "../constant/message";
import { ErrorType } from "../interface/Error";
import {
  duplicationColumnNameFromRequest,
  // duplicationNameFromRequest,
  relationalTableSaveBoard,
  relationalTableSaveTask,
  validateColumnName,
} from "../utils/GeneralUtils";
import { Column, Subtask } from "../interface/GeneralInterface";
import ResponseUtils from "../utils/Response";
import { StatusCodes } from "http-status-codes";
import ThrowError from "../utils/CustomError";
import {
  TargetUserBoard,
  TargetUserColumn,
  TargetUserSubtask,
  TargetUserTask,
} from "../utils/DatabasePrivilege";

const {
  duplicationBoardName,
  invalidColumn,
  invalidColumnsData,
  invalidBoardTarget,
  duplicateColumnName,
  invalidTaskTarget,
  duplicationColumnNames,
  invalidSubtaskTarget,
} = ERRORMESSAGE;
const {
  successfulNewBoard,
  successfulNewTask,
  getUserBoards,
  getBoardColumn,
  createNewColumn,
  taskDeleted,
  boardDeleted,
  columnDeleted,
  successfulSubtaskDelete,
  successfulColumnFetch,
  successfulTaskFetch,
  successfulTasksFetch,
  successfulsubtasksFetch,
  successfulsubtaskFetch,
  successfulboardFetch,
} = SUCCESSMESSAGE;
const {
  unsuccessfullNewBoard,
  unsuccessfullNewTask,
  unsuccessfulNewColumn,
  unsucessfulDeleteTask,
  unsucessfulDeleteBoard,
  unsuccessfulFetchColumn,
  unsucessfulDeleteColumn,
  unsuccessfulDeleteSubtask,
  unsuccessfulFetchBoardColumn,
  unsuccessfulFetchTask,
  unsuccessfulFetchTasks,
  unsuccessfulGetSubtask,
  unsuccessfulGetSubtasks,
  unsuccessfulFetchBoard,
} = LOGGERMESSAGE;

export default class UserController {

  /**
   * Adding new Board
   *
   */
  static async AddBoard(req: Request, res: Response, next: NextFunction) {
    try {
      // Validation request body data
      await addBoardSchemaValidation(req);

      const { loginId } = req.payload;
      const { name } = req.body;

      const searchDuplicateName = await prisma.board.findFirst({
        where: {
          createdBy: loginId,
          boardName: {
            search: name,
          },
        },
      });

      if (searchDuplicateName !== null) {
        //   Duplication board name
        ThrowError(
          ErrorType.VALIDATION,
          duplicationBoardName,
          unsuccessfullNewBoard
        );
      }

      const { columns } = req.body;
      if (columns && Array.isArray(columns)) {
        let filteredEmptyName: string[] = columns.filter(
          (col: string) => col.length > 0
        );
        if (filteredEmptyName.length > 0) {
          // Create board with columns
          duplicationColumnNameFromRequest(filteredEmptyName);
          validateColumnName(filteredEmptyName);
          let formatColumn: Column[] = filteredEmptyName.map((col, index) => ({
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
          const databaseResponse = await relationalTableSaveBoard(dbData);
          return ResponseUtils.sendSuccess(
            res,
            successfulNewBoard,
            StatusCodes.CREATED,
            {
              item: databaseResponse,
            }
          );
        }

        // Create board with no column
        const boardWithNoColumns = await prisma.board.create({
          data: {
            boardName: name,
            createdBy: loginId,
          },
          select: {
            boardId: true,
            boardName: true,
            createdAt: true,
            columns: true,
          },
        });

        return ResponseUtils.sendSuccess(
          res,
          successfulNewBoard,
          StatusCodes.CREATED,
          {
            item: boardWithNoColumns,
          }
        );
      }

      // Invalid Columns Data
      ThrowError(
        ErrorType.VALIDATION,
        invalidColumnsData,
        unsuccessfullNewBoard
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch list of boards
   *
   */
  static async GetBoards(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId } = req.payload;
      const response = await prisma.board.findMany({
        where: {
          createdBy: loginId,
        },
        select: {
          boardId: true,
          boardName: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return ResponseUtils.sendSuccess(res, getUserBoards, StatusCodes.OK, {
        items: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async GetBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId } = req.payload;
      const { boardId } = req.params;

      const findBoard = await TargetUserBoard(loginId, boardId);

      if (!findBoard) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidBoardTarget,
          unsuccessfulFetchBoard
        );

        return;
      }

      const boardDetail= await prisma.board.findFirst({
        where:{
          boardId
        },
        select:{
          boardId: true,
          boardName: true,
          columns:{
            select:{
              columnId: true,
              columnName: true,
              itemOrder: true,
              tasks: {
                select:{
                  taskId: true,
                  title: true,
                  itemOrder: true,
                  description: true,
                  subtasks: {
                    select:{
                      subtaskId: true,
                      title: true,
                      done: true
                    }
                  }
                },
                orderBy: {
                  itemOrder: "asc"
                }
              }

            },
            orderBy:{
              itemOrder: "asc"
            }
          }
        }
      })
      return ResponseUtils.sendSuccess(
        res,
        successfulboardFetch,
        StatusCodes.OK,
        { item: boardDetail }
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * Delete a user board
   *
   */
  static async DeleteBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId } = req.payload;
      const { boardId } = req.params;

      const boardTarget = await TargetUserBoard(loginId, boardId);
      if (!boardTarget) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidBoardTarget,
          unsucessfulDeleteBoard
        );
      }

      await prisma.board.delete({
        where: {
          boardId,
        },
      });
      return ResponseUtils.sendSuccess(res, boardDeleted, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add new column
   */
  static async AddColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const { boardId } = req.params;
      const { loginId } = req.payload;
      const { name } = req.body;

      const findBoard = await TargetUserBoard(loginId, boardId);

      if (!findBoard) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidBoardTarget,
          unsuccessfulNewColumn
        );
        return;
      }

      await addColumSchemaValidation(req);

      // Search already existing column name
      const searchduplicateColumnName = await prisma.column.findFirst({
        where: {
          boardId,
          columnName: {
            search: name,
            mode: "insensitive",
          },
        },
      });

      if (searchduplicateColumnName !== null) {
        ThrowError(
          ErrorType.VALIDATION,
          duplicateColumnName,
          unsuccessfulNewColumn
        );
      }

      const numberOfColumns = await prisma.column.count({
        where: {
          boardId,
        },
      });
      const saveNewColumn = await prisma.column.create({
        data: {
          columnName: name,
          boardId,
          itemOrder: numberOfColumns,
        },
        select:{
          columnId: true,
          columnName: true,
          itemOrder: true,
          tasks: true
        }
      });
      const response = {
        boardId,
        boardName: findBoard.boardName,
        column: {
          columnId: saveNewColumn.columnId,
          columnName: saveNewColumn.columnName,
          itemOrder: saveNewColumn.itemOrder,
          tasks: saveNewColumn.tasks
        },
      };
      ResponseUtils.sendSuccess(res, createNewColumn, StatusCodes.CREATED, {
        item: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch list of Columns
   *
   */
  static async GetColumns(req: Request, res: Response, next: NextFunction) {
    try {
      const { boardId } = req.params;
      const { loginId } = req.payload;

      const boardTarget = await TargetUserBoard(loginId, boardId);
      console.log(boardTarget);
      if (!boardTarget) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidBoardTarget,
          unsuccessfulFetchBoardColumn
        );
      }

      const response = await prisma.board.findFirst({
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
              tasks: true
            },
            orderBy: {
              itemOrder: "asc",
            },
          },
        },
      });

      ResponseUtils.sendSuccess(res, getBoardColumn, StatusCodes.OK, {
        item: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *Fetch column details
   */
  static async GetColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId } = req.payload;
      const { columnId } = req.params;
      const findColumn = await TargetUserColumn(loginId, columnId);

      if (!findColumn) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidColumn,
          unsuccessfulFetchColumn
        );
        return;
      }

      return ResponseUtils.sendSuccess(
        res,
        successfulColumnFetch,
        StatusCodes.OK,
        { item: findColumn }
      );
    } catch (error) {
      next(error);
    }
  }

  static async DeleteColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const { columnId } = req.params;
      const { loginId } = req.params;

      const findColumn = await TargetUserColumn(loginId, columnId);
      if (!findColumn) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidColumn,
          unsucessfulDeleteColumn
        );
      }
      const deleted = await prisma.column.delete({
        where: {
          columnId,
        },
        select: {
          boardId: true,
          itemOrder: true,
        },
      });

      await prisma.column.updateMany({
        where: {
          boardId: deleted.boardId,
          itemOrder: {
            gt: deleted.itemOrder,
          },
        },
        data: {
          itemOrder: {
            decrement: 1,
          },
        },
      });

      return ResponseUtils.sendError(res, columnDeleted, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add new task
   *
   */
  static async AddTask(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate columnId
      const { columnId } = req.params;
      const { title,description } = req.body;
      const { loginId } = req.payload;
      const findColumn = await TargetUserColumn(loginId, columnId);
      if (!findColumn) {
        ThrowError(ErrorType.NO_RESOURCE, invalidColumn, unsuccessfullNewTask);
      }

      // Validation request body data
      await taskSchemaValidation(req);

      // Validation Subtasks
      const { subtasks } = req.body;
      if (subtasks && Array.isArray(subtasks)) {
        // Remove empty subtasks field
        const filteredEmptyName: string[] = subtasks.filter(
          (subtask: string) => subtask.length > 0
        );
        if (filteredEmptyName.length > 0) {
          const formatSubtasks: Subtask[] = filteredEmptyName.map(
            (subtask) => ({ title: subtask })
          );

          // Increase order of task in a column by 1 and save new data with order of 0
          await prisma.task.updateMany({
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
              title,
              description: description ? description : "",
              itemOrder: 0,
            },
            subtasks: formatSubtasks,
          };

          const response = await relationalTableSaveTask(dbData, columnId);
          return ResponseUtils.sendSuccess(
            res,
            successfulNewTask,
            StatusCodes.CREATED,
            { item: response }
          );
        }

        // Save new task with no subtasks
        await prisma.task.updateMany({
          where: {
            columnId,
          },
          data: {
            itemOrder: {
              increment: 1,
            },
          },
        });

        const response = await prisma.task.create({
          data: {
            title,
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

        return ResponseUtils.sendSuccess(
          res,
          successfulNewTask,
          StatusCodes.CREATED,
          { item: response }
        );
      }

      // Save new task with no subtasks

      await prisma.task.updateMany({
        where: {
          columnId,
        },
        data: {
          itemOrder: {
            increment: 1,
          },
        },
      });
      const response= await prisma.task.create({
        data:{
          title,
          description: (description || typeof description==="string")? description: "",
          itemOrder:0,
          columnId
        },
        select:{
          taskId:true,
          title: true,
          description: true,
          itemOrder:true
        }
      })
      return ResponseUtils.sendSuccess(
        res,
        successfulNewTask,
        StatusCodes.CREATED,
        { item: response }
      );
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  /**
   * Get list of tasks in a column
   *
   */
  static async GetTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId } = req.payload;
      const { columnId } = req.params;

      const findColumn = await TargetUserColumn(loginId, columnId);

      if (!findColumn) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidColumn,
          unsuccessfulFetchTasks
        );
        return;
      }

      const response = await prisma.column.findFirst({
        where: {
          columnId,
        },
        select: {
          columnId: true,
          columnName: true,
          tasks: {
            select: {
              taskId: true,
              title: true,
              description: true,
              itemOrder: true,
            },
            orderBy: {
              itemOrder: "asc",
            },
          },
        },
      });

      return ResponseUtils.sendSuccess(
        res,
        successfulTasksFetch,
        StatusCodes.OK,
        { item: response }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch Task
   *
   */
  static async GetTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId } = req.payload;
      const { taskId } = req.params;

      const findTask = await TargetUserTask(loginId, taskId);
      if (!findTask) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidTaskTarget,
          unsuccessfulFetchTask
        );
        return;
      }
      const response = findTask.columns[0].tasks[0];
      return ResponseUtils.sendSuccess(
        res,
        successfulTaskFetch,
        StatusCodes.OK,
        { item: response }
      );
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  /**
   * Delete a task from a column
   */
  static async DeleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const { loginId } = req.payload;

      const findTask = await TargetUserTask(loginId, taskId);

      if (!findTask) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidTaskTarget,
          unsucessfulDeleteTask
        );
        return;
      }

      // Delete target task
      const deleteTargetTask = await prisma.task.delete({
        where: {
          taskId,
        },
        select: {
          itemOrder: true,
          columnId: true,
        },
      });

      // Restructure the order of task in the column
      await prisma.task.updateMany({
        where: {
          columnId: deleteTargetTask.columnId,
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
      ResponseUtils.sendSuccess(res, taskDeleted, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch Subtask Detail
   *
   */
  static async GetSubtask(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId } = req.payload;
      const { subtaskId } = req.params;

      const findSubtask = await TargetUserSubtask(loginId, subtaskId);
      if (!findSubtask) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidSubtaskTarget,
          unsuccessfulGetSubtask
        );
        return;
      }

      const response = findSubtask.columns[0].tasks[0].subtasks[0];
      return ResponseUtils.sendSuccess(
        res,
        successfulsubtaskFetch,
        StatusCodes.OK,
        { item: response }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch list of subtask
   *
   */
  static async GetSubtasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId } = req.payload;
      const { taskId } = req.params;

      const findTask = await TargetUserTask(loginId, taskId);

      if (!findTask) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidSubtaskTarget,
          unsuccessfulGetSubtasks
        );
        return;
      }

      const response = await prisma.task.findFirst({
        where: {
          taskId,
        },
        select: {
          taskId: true,
          title: true,
          description: true,
          subtasks: {
            select: {
              taskId: true,
              title: true,
              done: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return ResponseUtils.sendSuccess(
        res,
        successfulsubtasksFetch,
        StatusCodes.OK,
        { item: response }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   */
  static async DeleteSubtask(req: Request, res: Response, next: NextFunction) {
    try {
      const { subtaskId } = req.params;
      const { loginId } = req.body;
      const findSubtask = await TargetUserSubtask(loginId, subtaskId);
      if (!findSubtask) {
        ThrowError(
          ErrorType.NO_RESOURCE,
          invalidSubtaskTarget,
          unsuccessfulDeleteSubtask
        );
      }

      await prisma.subtask.delete({
        where: {
          subtaskId,
        },
      });
      return ResponseUtils.sendSuccess(
        res,
        successfulSubtaskDelete,
        StatusCodes.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
