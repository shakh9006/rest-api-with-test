import TodoService from "../services/TodoService";
import TodoRepository from "../repository/todo.repository";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { HttpErrorException } from "../../../exceptions/http-error.exception";
import { UpdateTodoDto } from "../dto/update-todo.dto";

const todoRepositoryMock = {
  createTodo: jest.fn(),
  getTodo: jest.fn(),
  getTodos: jest.fn(),
  deleteTodo: jest.fn(),
  updateTodo: jest.fn(),
};

const todoService = new TodoService(
  todoRepositoryMock as unknown as TodoRepository,
);

describe("TodoService", () => {
  describe("createTodo", () => {
    it("should throw error if title is not provided", async () => {
      const createTodoData: CreateTodoDto = { title: "", checked: true };
      await expect(todoService.createTodo(createTodoData)).rejects.toThrow(
        HttpErrorException.BadRequest("title is required"),
      );
    });

    it("should create todo", async () => {
      const createdTodo = { id: 1, title: "New todo", checked: true };
      const createTodoData: CreateTodoDto = {
        title: "New todo",
        checked: true,
      };

      todoRepositoryMock.createTodo.mockResolvedValue(createdTodo);

      const result = await todoService.createTodo(createTodoData);

      expect(todoRepositoryMock.createTodo).toHaveBeenCalledWith(
        createTodoData,
      );
      expect(result).toMatchObject(createdTodo);
    });
  });

  describe("updateTodo", () => {
    it("should throw error if todo does not exist", async () => {
      const updateTodoData: UpdateTodoDto = { checked: false };
      todoRepositoryMock.getTodo.mockResolvedValue(null);

      await expect(todoService.updateTodo(1, updateTodoData)).rejects.toThrow(
        HttpErrorException.BadRequest("Todo does not exist with id: 1"),
      );
    });

    it("should update todo", async () => {
      const updateTodoData: UpdateTodoDto = { checked: false };
      const existingTodo = { id: 1, title: "Update todo", checked: true };
      const updatedTodo = { id: 1, title: "Update todo", checked: false };

      todoRepositoryMock.getTodo.mockResolvedValue(existingTodo);
      todoRepositoryMock.updateTodo.mockResolvedValue(updatedTodo);

      const result = await todoService.updateTodo(1, updateTodoData);

      expect(todoRepositoryMock.getTodo).toHaveBeenCalledWith(1);
      expect(todoRepositoryMock.updateTodo).toHaveBeenCalledWith(
        1,
        updateTodoData,
      );
      expect(result).not.toBeNull();
      expect(result?.id).toBe(updatedTodo.id);
      expect(result?.title).toBe(updatedTodo.title);
      expect(result?.checked).toBe(updatedTodo.checked);
    });
  });

  describe("deleteTodo", () => {
    it("should throw error if todo does not exist", async () => {
      todoRepositoryMock.getTodo.mockResolvedValue(null);

      await expect(todoService.deleteTodo(1)).rejects.toThrow(
        HttpErrorException.BadRequest("Todo does not exist with id: 1"),
      );
    });

    it("should throw error if todo does not exist", async () => {
      const existingTodo = { id: 1, title: "Delete this todo", checked: false };

      todoRepositoryMock.getTodo.mockResolvedValue(existingTodo);
      todoRepositoryMock.deleteTodo.mockResolvedValue(existingTodo);

      const result = await todoService.deleteTodo(1);

      expect(todoRepositoryMock.getTodo).toHaveBeenCalledWith(1);
      expect(todoRepositoryMock.deleteTodo).toHaveBeenCalledWith(1);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(existingTodo.id);
      expect(result?.title).toBe(existingTodo.title);
      expect(result?.checked).toBe(existingTodo.checked);
    });
  });

  describe("getTodo", () => {
    it("should throw error if todo does not exist", async () => {
      todoRepositoryMock.getTodo.mockResolvedValue(null);

      await expect(todoService.getTodo(1)).rejects.toThrow(
        HttpErrorException.BadRequest("Todo does not exist with id: 1"),
      );
    });

    it("should return todo", async () => {
      const existingTodo = { id: 1, title: "Todo", checked: true };

      todoRepositoryMock.getTodo.mockResolvedValue(existingTodo);

      const result = await todoService.getTodo(1);

      expect(todoRepositoryMock.getTodo).toHaveBeenCalledWith(1);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(existingTodo.id);
      expect(result?.title).toBe(existingTodo.title);
      expect(result?.checked).toBe(existingTodo.checked);
    });
  });

  describe("getTodos", () => {
    it("should return todo list", async () => {
      const existingTodos = [
        { id: 1, title: "Todo 1", checked: true },
        { id: 2, title: "Todo 2", checked: false },
      ];

      todoRepositoryMock.getTodos.mockResolvedValue(existingTodos);

      const result = await todoService.getTodos();

      expect(todoRepositoryMock.getTodos).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result?.length).toBe(2);
    });
  });
});
