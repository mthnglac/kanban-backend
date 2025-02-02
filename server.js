import express from "express";
import * as db from "./dbHelper.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Board
app.get("/boards", async (req, res) => {
  try {
    const boardId = Number(req.params.id);
    const boards = await db.getAllBoards(boardId);

    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/board/:id", async (req, res) => {
  try {
    const boardId = Number(req.params.id);
    const board = await db.getBoardNodeById(boardId);

    if (!board) {
      return res.status(404).json({ error: "Board not found " });
    }

    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/board", async (req, res) => {
  try {
    const board = await db.createBoardNode();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Flow
app.get("/flows", async (req, res) => {
  try {
    const boardId = Number(req.query.boardId);
    const flows = await db.getAllFlows(boardId);

    res.status(200).json(flows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/flow/:id", async (req, res) => {
  try {
    const flowId = Number(req.params.id);
    const flow = await db.getFlowNodeById(flowId);

    if (!flow) {
      return res.status(404).json({ error: "Flow not found " });
    }

    res.status(200).json(flow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/flow", async (req, res) => {
  try {
    const { title, description, boardNodeId } = req.body;

    if (!title || !description || !boardNodeId) {
      return res
        .status(400)
        .json({ error: "Title, description and BoardNodeId are required" });
    }

    const flowNode = await db.createFlowNode(
      title,
      description,
      Number(boardNodeId)
    );
    res.status(201).json(flowNode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/flow/:id", async (req, res) => {
  try {
    const flowNodeId = Number(req.params.id);
    const deletedFlow = await db.deleteFlowNode(flowNodeId);

    if (!deletedFlow) {
      return res.status(404).json({ error: "Flow not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch("/flow/:id", async (req, res) => {
  try {
    const flowNodeId = Number(req.params.id);
    const { title, description } = req.body;
    const flowNode = await db.updateFlowNode(flowNodeId, {
      title: title ?? "",
      description: description ?? "",
    });

    if (!flowNode) {
      return res.status(404).json({ error: "Flow not found" });
    }

    res.status(200).json(flowNode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task
app.get("/tasks", async (req, res) => {
  try {
    const flowId = Number(req.query.id);
    const tasks = await db.getAllTasks(flowId);

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/task/:id", async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const task = await db.getTaskNodeById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found " });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/task", async (req, res) => {
  try {
    const { title, description, flowNodeId } = req.body;

    if (!title || !description || !flowNodeId) {
      return res
        .status(400)
        .json({ error: "Title, description and FlowNodeId are required" });
    }

    const taskNode = await db.createTaskNode(
      title,
      description,
      Number(flowNodeId)
    );
    res.status(201).json(taskNode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/task/:id", async (req, res) => {
  try {
    const taskNodeId = Number(req.params.id);
    const deletedTask = await db.deleteTaskNode(taskNodeId);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch("/task/:id", async (req, res) => {
  try {
    const taskNodeId = Number(req.params.id);
    const { title, description } = req.body;
    const taskNode = await db.updateTaskNode(taskNodeId, {
      title: title ?? "",
      description: description ?? "",
    });

    if (!taskNode) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(taskNode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Subtask
app.get("/subtasks", async (req, res) => {
  try {
    const taskId = Number(req.query.id);
    const subtasks = await db.getAllSubtasks(taskId);

    res.status(200).json(subtasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/subtask", async (req, res) => {
  try {
    const { title, taskNodeId } = req.body;

    if (!title || !taskNodeId) {
      return res
        .status(400)
        .json({ error: "Title and TaskNodeId are required" });
    }

    const subtaskNode = await db.createSubtaskNode(
      title,
      Number(taskNodeId)
    );
    res.status(201).json(subtaskNode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/subtask/:id", async (req, res) => {
  try {
    const subtaskId = Number(req.params.id);
    const subtask = await db.getSubtaskNodeById(subtaskId);

    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found " });
    }

    res.status(200).json(subtask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/subtask/:id", async (req, res) => {
  try {
    const subtaskNodeId = Number(req.params.id);
    const deletedSubtask = await db.deleteSubtaskNode(subtaskNodeId);

    if (!deletedSubtask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch("/subtask/:id", async (req, res) => {
  try {
    const subtaskNodeId = Number(req.params.id);
    const { title, completed, taskNodeId } = req.body;
    const subtaskNode = await db.updateSubtaskNode(subtaskNodeId, {
      title: title ?? "",
      completed: completed ?? false,
      taskNodeId,
    });

    if (!subtaskNode) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    res.status(200).json(subtaskNode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app, server };