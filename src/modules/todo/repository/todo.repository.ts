import { Todo } from "@prisma/client";
import { prisma } from "../../../database/prisma.client";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { UpdateTodoDto } from "../dto/update-todo.dto";

class TodoRepository {
  async createTodo(data: CreateTodoDto): Promise<Todo> {
    return await prisma.todo.create({
      data,
    });
  }

  async updateTodo(id: number, data: UpdateTodoDto): Promise<Todo> {
    return await prisma.todo.update({
      where: { id },
      data,
    });
  }

  async deleteTodo(id: number): Promise<Todo | null> {
    return await prisma.todo.delete({
      where: { id },
    });
  }

  async getTodo(id: number): Promise<Todo | null> {
    return await prisma.todo.findUnique({
      where: { id },
    });
  }

  async getTodos(): Promise<Todo[]> {
    return await prisma.todo.findMany();
  }
}

export default TodoRepository;
