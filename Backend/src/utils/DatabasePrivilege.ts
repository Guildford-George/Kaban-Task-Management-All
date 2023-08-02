import prisma from "../config/database";

export const TargetUserBoard = async (loginId: string, boardId: string) => {
  try {
    const board = await prisma.board.findFirst({
      where: {
        createdBy: loginId,
        boardId,
      },
      select: {
        boardId: true,
        boardName: true,
        createdAt: true,
      },
    });
    if (board === null) {
      return false;
    }
    return board;
  } catch (error) {
    throw error;
  }
};

export const TargetUserColumn = async (loginId: string, columnId: string) => {
  try {
    // const column = await prisma.board.findFirst({
    //   where: {
    //     createdBy: loginId,
    //     columns:{
          
    //     }
    //   },
    //   select: {
    //     boardId: true,
    //     boardName: true,
    //     createdAt: true,
    //     columns: {
    //       where: {
    //         columnId,
    //       },
    //       select: {
    //         columnId: true,
    //         columnName: true,
    //         itemOrder: true,
    //       },
    //     },
    //   },
    // });

    const column= await prisma.column.findFirst({
      where:{
        columnId
      },
    })
    console.log(column)
    if (column === null) {
      return false;
    }
    return column
  } catch (error) {
    throw error;
  }
};

export const TargetUserTask = async (loginId: string, taskId: string) => {
  try {
    const task = await prisma.board.findFirst({
      where: {
        createdBy: loginId,
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
              },
              where: {
                taskId,
              },
            },
          },
        },
      },
    });

    if (task === null || task.columns.length==0) {
      return false;
    }
    if(task.columns[0].tasks.length==0){
      return false
    }
    return task;
  } catch (error) {
    throw error;
  }
};

export const TargetUserSubtask = async (loginId: string, subtaskId: string) => {
  try {
    const subtask = await prisma.board.findFirst({
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
                    done: true,
                  },
                  where: {
                    subtaskId,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (subtask === null || subtask.columns.length==0) {
      return false;
    }
    if(subtask.columns[0].tasks.length==0 || subtask.columns[0].tasks[0].subtasks.length==0){
      return false
    }
    return subtask;
  } catch (error) {
    throw error;
  }
};
