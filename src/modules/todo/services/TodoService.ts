import TodoRepository from "../repository/todo.repository";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { Todo } from "@prisma/client";
import { HttpErrorException } from "../../../exceptions/http-error.exception";
import { UpdateTodoDto } from "../dto/update-todo.dto";

class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  async createTodo(data: CreateTodoDto): Promise<Todo> {
    if (!data.title) {
      throw HttpErrorException.BadRequest("title is required");
    }
    return await this.todoRepository.createTodo(data);
  }

  async updateTodo(id: number, data: UpdateTodoDto): Promise<Todo | never> {
    const todo = await this.todoRepository.getTodo(id);
    if (!todo) {
      throw HttpErrorException.BadRequest(`Todo does not exist with id: ${id}`);
    }
    return await this.todoRepository.updateTodo(id, data);
  }

  async deleteTodo(id: number): Promise<Todo | never> {
    const todo = await this.todoRepository.getTodo(id);
    if (!todo) {
      throw HttpErrorException.BadRequest(`Todo does not exist with id: ${id}`);
    }

    return await this.todoRepository.deleteTodo(id);
  }

  async getTodo(id: number): Promise<Todo | null> {
    const todo = await this.todoRepository.getTodo(id);
    if (!todo) {
      throw HttpErrorException.BadRequest(`Todo does not exist with id: ${id}`);
    }

    return todo;
  }

  async getTodos(): Promise<Todo[]> {
    return await this.todoRepository.getTodos();
  }
}

export default TodoService;
