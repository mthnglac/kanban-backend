import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
     db: {
      url: process.env.DATABASE_URL
     },
  },
});

prisma.$use(async (params, next) => {
  if (
    params.model === "SubtaskNode" &&
    (params.action === "update" ||
      params.action === "create" ||
      params.action === "delete")
  ) {
    const result = await next(params);

    let subtaskId;
    if (params.action === "delete") {
      subtaskId = params.args.where.id;
    } else if (params.action === "create") {
      subtaskId = result.id;
    } else {
      subtaskId = params.args.where.id;
    }

    const subtask = await prisma.subtaskNode.findUnique({
      where: {
        id: subtaskId,
      },
      include: {
        taskNode: {
          include: {
            subtaskNodes: true,
          },
        },
      },
    });

    if (subtask && subtask.taskNode) {
      const task = subtask.taskNode;
      const completedSubtasks = task.subtaskNodes.filter(
        (node) => node.completed
      ).length;
      const progress =
        task.subtaskNodes.length === 0
          ? 0
          : Math.floor((completedSubtasks / task.subtaskNodes.length) * 100);

      await prisma.taskNode.update({
        where: { id: task.id },
        data: { progress },
      });
    }

    return result;
  }

  return next(params);
});

// Board Node Functions
async function createBoardNode() {
  return prisma.boardNode.create({ data: {} });
}

async function getBoardNodeById(id) {
  return prisma.boardNode.findUnique({ where: { id } });
}

async function getAllBoards() {
  return prisma.boardNode.findMany();
}

// Flow Node Functions
async function getAllFlows(boardNodeId) {
  return prisma.flowNode.findMany({
    where: { ...(boardNodeId && { boardNodeId }) },
  });
}

async function getFlowNodeById(id) {
  return prisma.flowNode.findUnique({ where: { id } });
}

async function createFlowNode(title, description, boardNodeId) {
  const lastFlow = await prisma.flowNode.findFirst({
    where: { boardNodeId },
    orderBy: { order: "desc" },
  });
  const nextOrder = lastFlow ? lastFlow.order + 1 : 0;

  return prisma.flowNode.create({
    data: { title, description, boardNodeId, order: nextOrder },
  });
}

async function updateFlowNode(id, partialData) {
  return prisma.flowNode.update({
    where: { id },
    data: partialData,
  });
}

async function deleteFlowNode(id) {
  return prisma.flowNode.delete({
    where: { id },
  });
}

// Task Node Functions
async function getAllTasks(flowNodeId) {
  return prisma.taskNode.findMany({
    where: { ...(flowNodeId && { flowNodeId }) },
  });
}

async function getTaskNodeById(id) {
  return prisma.taskNode.findUnique({ where: { id } });
}

async function createTaskNode(title, description, flowNodeId) {
  const lastTask = await prisma.taskNode.findFirst({
    where: { flowNodeId },
    orderBy: { order: "desc" },
  });
  const nextOrder = lastTask ? lastTask.order + 1 : 0;

  return prisma.taskNode.create({
    data: { title, description, flowNodeId, order: nextOrder },
  });
}

async function updateTaskNode(id, partialData) {
  return prisma.taskNode.update({
    where: { id },
    data: partialData,
  });
}

async function deleteTaskNode(id) {
  return prisma.taskNode.delete({
    where: { id },
  });
}

// Subtask Node Functions
async function getSubtaskNodeById(id) {
  return prisma.subtaskNode.findUnique({ where: { id } });
}

async function getAllSubtasks(taskNodeId) {
  return prisma.subtaskNode.findMany({
    where: { ...(taskNodeId && { taskNodeId }) },
  });
}

async function createSubtaskNode(title, taskNodeId) {
  return prisma.subtaskNode.create({
    data: { title, completed: false, taskNodeId },
  });
}

async function updateSubtaskNode(id, data) {
  return prisma.subtaskNode.update({
    where: { id },
    data,
  });
}

async function deleteSubtaskNode(id) {
  return prisma.subtaskNode.delete({
    where: { id },
  });
}

export {
  getAllBoards,
  getBoardNodeById,
  createBoardNode,
  getFlowNodeById,
  getAllFlows,
  createFlowNode,
  updateFlowNode,
  deleteFlowNode,
  getTaskNodeById,
  getAllTasks,
  createTaskNode,
  updateTaskNode,
  deleteTaskNode,
  getSubtaskNodeById,
  getAllSubtasks,
  createSubtaskNode,
  updateSubtaskNode,
  deleteSubtaskNode,
  prisma,
};
