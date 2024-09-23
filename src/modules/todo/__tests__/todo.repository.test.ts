import TodoRepository from "../repository/todo.repository";
import { prisma } from "../../../database/prisma.client";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { UpdateTodoDto } from "../dto/update-todo.dto";

const todoRepository = new TodoRepository();

beforeEach(async () => {
  await prisma.$executeRaw`BEGIN`;
  await prisma.todo.createMany({
    data: [
      { title: "Test Todo 1", checked: false },
      { title: "Test Todo 2", checked: true },
    ],
  });
});

afterEach(async () => {
  await prisma.$executeRaw`ROLLBACK`;
});

describe("TodoRepository", () => {
  describe("create todo", () => {
    it("should create new todo", async () => {
      const createTodoData: CreateTodoDto = {
        title: "New Todo",
        checked: true,
      };

      const newTodo = await todoRepository.createTodo(createTodoData);

      expect(newTodo).not.toBeNull();
      expect(newTodo).toMatchObject(createTodoData);
    });
  });

  describe("update todo", () => {
    it("should update todo", async () => {
      const updateTodoData: UpdateTodoDto = {
        checked: false,
      };

      const updatedTodo = await todoRepository.updateTodo(1, updateTodoData);
      const fetchTodo = await prisma.todo.findUnique({ where: { id: 1 } });

      expect(updatedTodo).not.toBeNull();
      expect(fetchTodo).not.toBeNull();
      expect(updatedTodo).toMatchObject(fetchTodo);
    });
  });

  describe("get todo", () => {
    it("should get todo by id", async () => {
      const lastTodos = await prisma.todo.findMany({
        orderBy: {
          id: "desc",
        },
        take: 1,
      });

      const lastTodo = lastTodos[lastTodos.length - 1];
      const fetchTodo = await todoRepository.getTodo(lastTodo.id);

      expect(fetchTodo).not.toBeNull();
      expect(fetchTodo).toMatchObject(lastTodo);
    });
  });

  describe("get todos", () => {
    it("should get todos list", async () => {
      const todos = await prisma.todo.findMany();
      const fetchTodos = await todoRepository.getTodos();

      expect(fetchTodos).not.toBeNull();
      expect(fetchTodos).toMatchObject(todos);
    });
  });

  describe("delete todos", () => {
    it("should delete todo", async () => {
      const lastTodos = await prisma.todo.findMany();
      const lastTodo = lastTodos[lastTodos.length - 1];

      const deletedTodo = await todoRepository.deleteTodo(lastTodo.id);
      const afterDelete = await todoRepository.getTodo(lastTodo.id);

      expect(deletedTodo).not.toBeNull();
      expect(afterDelete).toBeNull();
    });
  });
});
