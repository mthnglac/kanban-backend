import request from 'supertest';
import { app, server } from '../server.js';

jest.mock('../dbHelper.js', () => ({
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
}));

import * as db from '../dbHelper.js';

describe('Server Tests', () => {
  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should respond with a 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('should return JSON data', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toEqual({ message: 'Hello World!' });
  });

  // Flow Node Tests
  test('should delete a flow node', async () => {
    db.deleteFlowNode.mockResolvedValue(true);
    const response = await request(app).delete('/flow/1');
    expect(response.status).toBe(204);
  });

  test('should return 404 if flow node not found', async () => {
    db.deleteFlowNode.mockResolvedValue(null);
    const response = await request(app).delete('/flow/1');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Flow not found');
  });

  test('should update a flow node', async () => {
    const flowNode = { id: 1, title: 'Updated Title', description: 'Updated Description' };
    db.updateFlowNode.mockResolvedValue(flowNode);
    const response = await request(app).patch('/flow/1').send({ title: 'Updated Title', description: 'Updated Description' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(flowNode);
  });

  // Task Node Tests
  test('should get all tasks', async () => {
    const tasks = [{ id: 1, title: 'Task 1' }];
    db.getAllTasks.mockResolvedValue(tasks);
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(tasks);
  });

  test('should get a task by id', async () => {
    const task = { id: 1, title: 'Task 1' };
    db.getTaskNodeById.mockResolvedValue(task);
    const response = await request(app).get('/task/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(task);
  });

  test('should create a task', async () => {
    const task = { id: 1, title: 'New Task', description: 'Description', flowNodeId: 1 };
    db.createTaskNode.mockResolvedValue(task);
    const response = await request(app).post('/task').send({ title: 'New Task', description: 'Description', flowNodeId: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(task);
  });

  test('should delete a task', async () => {
    db.deleteTaskNode.mockResolvedValue(true);
    const response = await request(app).delete('/task/1');
    expect(response.status).toBe(204);
  });

  // Subtask Node Tests
  test('should get all subtasks', async () => {
    const subtasks = [{ id: 1, title: 'Subtask 1' }];
    db.getAllSubtasks.mockResolvedValue(subtasks);
    const response = await request(app).get('/subtasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(subtasks);
  });

  test('should get a subtask by id', async () => {
    const subtask = { id: 1, title: 'Subtask 1' };
    db.getSubtaskNodeById.mockResolvedValue(subtask);
    const response = await request(app).get('/subtask/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(subtask);
  });

  test('should create a subtask', async () => {
    const subtask = { id: 1, title: 'New Subtask', taskNodeId: 1 };
    db.createSubtaskNode.mockResolvedValue(subtask);
    const response = await request(app).post('/subtask').send({ title: 'New Subtask', taskNodeId: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(subtask);
  });

  test('should delete a subtask', async () => {
    db.deleteSubtaskNode.mockResolvedValue(true);
    const response = await request(app).delete('/subtask/1');
    expect(response.status).toBe(204);
  });

  test('should update a subtask', async () => {
    const subtask = { id: 1, title: 'Updated Subtask', completed: true, taskNodeId: 1 };
    db.updateSubtaskNode.mockResolvedValue(subtask);
    const response = await request(app).patch('/subtask/1').send({ title: 'Updated Subtask', completed: true, taskNodeId: 1 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(subtask);
  });
});