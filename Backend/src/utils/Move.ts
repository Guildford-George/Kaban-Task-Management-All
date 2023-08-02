import prisma from "../config/database";
import { MoveTaskData } from "../interface/GeneralInterface";

export const MoveTaskVertically = async (moveTaskData: MoveTaskData) => {
  const { destination, source } = moveTaskData;
  if (
    destination.columnId === source.columnId &&
    destination.index !== source.index
  ) {
    if (source.index > destination.index) {
      // Move Up

      await prisma.task.updateMany({
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
    } else {
      // Move Down

      await prisma.task.updateMany({
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

    await prisma.task.update({
      where: {
        taskId: destination.taskId,
      },
      data: {
        itemOrder: destination.index,
      },
    });

    const moveResponse = await prisma.column.findFirst({
      where: {
        columnId: source.columnId,
      },
    });
    return { source: moveResponse, destination: moveResponse };
  }
};

export const MoveTaskHorizontally = async (moveTaskData: MoveTaskData) => {
  const { destination, source } = moveTaskData;
  const totalDestinationTasks = await prisma.task.count({
    where: {
      columnId: destination.columnId,
    },
  });
  const totalSourceTasks = await prisma.task.count({
    where: {
      columnId: source.columnId,
    },
  });

  if (
    destination.index <= totalDestinationTasks + 1 &&
    source.index <= totalSourceTasks
  ) {
    await prisma.$transaction([
      // update order of destination

      prisma.task.updateMany({
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
      prisma.task.updateMany({
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

    const moveResponse = await prisma.$transaction([
      // updated source
      prisma.column.findFirst({
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
      prisma.column.findFirst({
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
