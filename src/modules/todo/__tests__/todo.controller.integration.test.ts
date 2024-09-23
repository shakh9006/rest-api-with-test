import { prisma } from "../../../database/prisma.client";
import request from "supertest";
import generateServer from "../../../server";
import { TodoStatusCodes } from "../../../types/todo-status-codes";
import { TodoStatusMessages } from "../../../types/todo-status-messages";

const app = generateServer();

beforeEach(async () => {
  await prisma.$executeRaw`BEGIN`;
  await prisma.todo.createMany({
    data: [
      { title: "Test Todo 1", checked: true },
      { title: "Test Todo 2", checked: false },
    ],
  });
});

afterEach(async () => {
  await prisma.$executeRaw`ROLLBACK`;
});

afterAll(async () => {
  await prisma.$disconnect(); // Closes the Prisma connection
});

describe("Todo routes", () => {
  describe("Get todo by id", () => {
    it("should return error", async () => {
      const res = await request(app).get(`/api/v1/todo/222222`);

      expect(res).not.toBeNull();
      expect(res?.statusCode).toBe(TodoStatusCodes.TODO_BAD_REQUEST);
    });

    it("should return a todo by id", async () => {
      const todos = await prisma.todo.findMany({
        take: 1,
        orderBy: {
          id: "desc",
        },
      });
      const lastTodo = todos[todos?.length - 1];
      const res = await request(app).get(`/api/v1/todo/${lastTodo?.id}`);

      expect(res).not.toBeNull();
      expect(res?.statusCode).toBe(TodoStatusCodes.TODO_GOT_SUCCESSFULLY);
      expect(res?.body?.message).toBe(TodoStatusMessages.TODO_GOT_SUCCESSFULLY);
    });
  });

  describe("Get todo list", () => {
    it("should return todo list", async () => {
      const todos = await prisma.todo.findMany();
      const res = await request(app).get("/api/v1/todo");

      expect(res).not.toBeNull();
      expect(res?.statusCode).toBe(TodoStatusCodes.TODO_GOT_LIST_SUCCESSFULLY);
      expect(res?.body?.message).toBe(
        TodoStatusMessages.TODO_GOT_LIST_SUCCESSFULLY,
      );
      expect(res?.body?.data?.length).toBe(todos.length);
    });
  });

  describe("Create todo", () => {
    it("should return error", async () => {
      const res = await request(app).post(`/api/v1/todo`);

      expect(res).not.toBeNull();
      expect(res?.statusCode).toBe(TodoStatusCodes.TODO_BAD_REQUEST);
      expect(res?.body?.message).toBe("title is required");
      expect(res?.body?.success).toBe(false);
    });

    it("should create todo", async () => {
      const res = await request(app)
        .post(`/api/v1/todo`)
        .send({ title: "New Todo", checked: true });

      expect(res).not.toBeNull();
      expect(res?.statusCode).toBe(TodoStatusCodes.TODO_CREATED_SUCCESSFULLY);
      expect(res?.body?.message).toBe(
        TodoStatusMessages.TODO_CREATED_SUCCESSFULLY,
      );
      expect(res?.body?.data?.title).toBe("New Todo");
      expect(res?.body?.data?.checked).toBe(true);
    });
  });

  describe("Update todo", () => {
    it("should return error", async () => {
      const res = await request(app).put(`/api/v1/todo/22222`);

      expect(res).not.toBeNull();
      expect(res?.statusCode).toBe(TodoStatusCodes.TODO_BAD_REQUEST);
    });

    it("should update todo by id", async () => {
      const todos = await prisma.todo.findMany({
        take: 1,
        orderBy: {
          id: "desc",
        },
      });

      const lastTodo = todos[todos?.length - 1];
      const res = await request(app)
        .put(`/api/v1/todo/${lastTodo.id}`)
        .send({ checked: false });

      expect(res).not.toBeNull();
      expect(res?.statusCode).toBe(TodoStatusCodes.TODO_UPDATED_SUCCESSFULLY);
      expect(res?.body?.message).toBe(
        TodoStatusMessages.TODO_UPDATED_SUCCESSFULLY,
      );
      expect(res?.body?.data?.checked).toBe(false);
    });
  });

  describe("Delete todo", () => {
    it("should return error", async () => {
      const res = await request(app).delete(`/api/v1/todo/222222`);

      expect(res).not.toBeNull();
      expect(res?.statusCode).toBe(TodoStatusCodes.TODO_BAD_REQUEST);
    });

    it("should delete todo by id", async () => {
      const todos = await prisma.todo.findMany({
        take: 1,
        orderBy: {
          id: "desc",
        },
      });
      const lastTodo = todos[todos?.length - 1];
      const res = await request(app).delete(`/api/v1/todo/${lastTodo?.id}`);

      expect(res).not.toBeNull();
      expect(res?.statusCode).toBe(TodoStatusCodes.TODO_DELETED_SUCCESSFULLY);
      expect(res?.body?.message).toBe(
        TodoStatusMessages.TODO_DELETED_SUCCESSFULLY,
      );
    });
  });
});
