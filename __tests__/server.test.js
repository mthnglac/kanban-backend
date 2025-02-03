import request from "supertest";
import { app, server } from "../server.js";

jest.mock("../dbHelper.js", () => ({
  deleteFlowNode: jest.fn(),
  updateFlowNode: jest.fn(),
  getAllTasks: jest.fn(),
  getTaskNodeById: jest.fn(),
  createTaskNode: jest.fn(),
  deleteTaskNode: jest.fn(),
  updateTaskNode: jest.fn(),
  getAllSubtasks: jest.fn(),
  getSubtaskNodeById: jest.fn(),
  createSubtaskNode: jest.fn(),
  deleteSubtaskNode: jest.fn(),
  updateSubtaskNode: jest.fn(),
  getAllBoards: jest.fn(),
  getBoardNodeById: jest.fn(),
  createBoardNode: jest.fn(),
  getAllFlows: jest.fn(),
  getFlowNodeById: jest.fn(),
  createFlowNode: jest.fn(),
}));

import * as db from "../dbHelper.js";

describe("Server Tests", () => {
  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  test("should return JSON data", async () => {
    const response = await request(app).get("/");
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({ message: "Hello World!" });
  });

  // Board Node Tests
  test("should get all boards", async () => {
    const boards = [{ id: 1, createdAt: "2023-10-01T00:00:00.000Z" }];
    db.getAllBoards.mockResolvedValue(boards);
    const response = await request(app).get("/boards");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(boards);
  });

  test("should get a board by id", async () => {
    const board = { id: 1, createdAt: "2023-10-01T00:00:00.000Z" };
    db.getBoardNodeById.mockResolvedValue(board);
    const response = await request(app).get("/board/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(board);
  });

  test("should create a board", async () => {
    const board = { id: 1, createdAt: "2023-10-01T00:00:00.000Z" };
    db.createBoardNode.mockResolvedValue(board);
    const response = await request(app).post("/board");
    expect(response.status).toBe(201);
    expect(response.body).toEqual(board);
  });

  // Flow Node Tests
  test("should get all flows", async () => {
    const flows = [
      {
        id: 1,
        title: "Flow 1",
        description: "Description",
        boardNodeId: 1,
        order: 0,
      },
    ];
    db.getAllFlows.mockResolvedValue(flows);
    const response = await request(app).get("/flows?boardNodeId=1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(flows);
  });

  test("should get a flow by id", async () => {
    const flow = {
      id: 1,
      title: "Flow 1",
      description: "Description",
      boardNodeId: 1,
      order: 0,
    };
    db.getFlowNodeById.mockResolvedValue(flow);
    const response = await request(app).get("/flow/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(flow);
  });

  test("should create a flow", async () => {
    const flow = {
      id: 1,
      title: "Flow 1",
      description: "Description",
      boardNodeId: 1,
      order: 0,
    };
    db.createFlowNode.mockResolvedValue(flow);
    const response = await request(app)
      .post("/flow")
      .send({ title: "Flow 1", description: "Description", boardNodeId: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(flow);
  });

  test("should delete a flow", async () => {
    db.deleteFlowNode.mockResolvedValue(true);
    const response = await request(app).delete("/flow/1");
    expect(response.status).toBe(204);
  });

  test("should update a flow", async () => {
    const flow = {
      id: 1,
      title: "Updated Flow",
      description: "Updated Description",
      order: 1,
    };
    db.updateFlowNode.mockResolvedValue(flow);
    const response = await request(app)
      .patch("/flow/1")
      .send({
        title: "Updated Flow",
        description: "Updated Description",
        order: 1,
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(flow);
  });

  // Task Node Tests
  test("should get all tasks", async () => {
    const tasks = [
      {
        id: 1,
        title: "Task 1",
        description: "Description",
        flowNodeId: 1,
        order: 0,
      },
    ];
    db.getAllTasks.mockResolvedValue(tasks);
    const response = await request(app).get("/tasks?flowNodeId=1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(tasks);
  });

  test("should get a task by id", async () => {
    const task = {
      id: 1,
      title: "Task 1",
      description: "Description",
      flowNodeId: 1,
      order: 0,
    };
    db.getTaskNodeById.mockResolvedValue(task);
    const response = await request(app).get("/task/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(task);
  });

  test("should create a task", async () => {
    const task = {
      id: 1,
      title: "New Task",
      description: "Description",
      flowNodeId: 1,
      order: 0,
    };
    db.createTaskNode.mockResolvedValue(task);
    const response = await request(app)
      .post("/task")
      .send({ title: "New Task", description: "Description", flowNodeId: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(task);
  });

  test("should delete a task", async () => {
    db.deleteTaskNode.mockResolvedValue(true);
    const response = await request(app).delete("/task/1");
    expect(response.status).toBe(204);
  });

  test("should update a task", async () => {
    const task = {
      id: 1,
      title: "Updated Task",
      description: "Updated Description",
      order: 1,
      flowNodeId: 1,
    };
    db.updateTaskNode.mockResolvedValue(task);
    const response = await request(app)
      .patch("/task/1")
      .send({
        title: "Updated Task",
        description: "Updated Description",
        order: 1,
        flowNodeId: 1,
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(task);
  });

  // Subtask Node Tests
  test("should get all subtasks", async () => {
    const subtasks = [
      { id: 1, title: "Subtask 1", completed: false, taskNodeId: 1 },
    ];
    db.getAllSubtasks.mockResolvedValue(subtasks);
    const response = await request(app).get("/subtasks?taskNodeId=1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(subtasks);
  });

  test("should get a subtask by id", async () => {
    const subtask = {
      id: 1,
      title: "Subtask 1",
      completed: false,
      taskNodeId: 1,
    };
    db.getSubtaskNodeById.mockResolvedValue(subtask);
    const response = await request(app).get("/subtask/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(subtask);
  });

  test("should create a subtask", async () => {
    const subtask = {
      id: 1,
      title: "New Subtask",
      completed: false,
      taskNodeId: 1,
    };
    db.createSubtaskNode.mockResolvedValue(subtask);
    const response = await request(app)
      .post("/subtask")
      .send({ title: "New Subtask", taskNodeId: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(subtask);
  });

  test("should delete a subtask", async () => {
    db.deleteSubtaskNode.mockResolvedValue(true);
    const response = await request(app).delete("/subtask/1");
    expect(response.status).toBe(204);
  });

  test("should update a subtask", async () => {
    const subtask = {
      id: 1,
      title: "Updated Subtask",
      completed: true,
      taskNodeId: 1,
    };
    db.updateSubtaskNode.mockResolvedValue(subtask);
    const response = await request(app)
      .patch("/subtask/1")
      .send({ title: "Updated Subtask", completed: true, taskNodeId: 1 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(subtask);
  });
});
