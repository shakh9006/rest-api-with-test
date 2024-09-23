import { Request, Response, NextFunction } from "express";
import { TodoStatusCodes } from "../../../types/todo-status-codes";
import { TodoStatusMessages } from "../../../types/todo-status-messages";
import TodoService from "../services/TodoService";
import { HttpErrorException } from "../../../exceptions/http-error.exception";

class TodoController {
  constructor(private todoService: TodoService) {
    this.createTodo = this.createTodo.bind(this);
    this.getTodos = this.getTodos.bind(this);
    this.getTodo = this.getTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const todo = await this.todoService.createTodo(body);

      res.status(TodoStatusCodes.TODO_CREATED_SUCCESSFULLY).send({
        statusCode: TodoStatusCodes.TODO_CREATED_SUCCESSFULLY,
        message: TodoStatusMessages.TODO_CREATED_SUCCESSFULLY,
        data: { ...todo },
      });
    } catch (err) {
      next(HttpErrorException.BadRequest(err.message));
    }
  }

  async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const body = req.body;

      const todo = await this.todoService.updateTodo(id, body);

      res.send({
        statusCode: TodoStatusCodes.TODO_UPDATED_SUCCESSFULLY,
        message: TodoStatusMessages.TODO_UPDATED_SUCCESSFULLY,
        data: todo,
      });
    } catch (err) {
      next(HttpErrorException.BadRequest(err.message));
    }
  }

  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const todo = await this.todoService.deleteTodo(id);

      res.send({
        statusCode: TodoStatusCodes.TODO_DELETED_SUCCESSFULLY,
        message: TodoStatusMessages.TODO_DELETED_SUCCESSFULLY,
        data: todo,
      });
    } catch (err) {
      next(HttpErrorException.BadRequest(err.message));
    }
  }

  async getTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const todo = await this.todoService.getTodo(id);

      res.send({
        statusCode: TodoStatusCodes.TODO_GOT_SUCCESSFULLY,
        message: TodoStatusMessages.TODO_GOT_SUCCESSFULLY,
        data: todo,
      });
    } catch (err) {
      next(HttpErrorException.BadRequest(err.message));
    }
  }

  async getTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const todos = await this.todoService.getTodos();
      res.send({
        statusCode: TodoStatusCodes.TODO_GOT_LIST_SUCCESSFULLY,
        message: TodoStatusMessages.TODO_GOT_LIST_SUCCESSFULLY,
        data: todos,
      });
    } catch (err) {
      next(HttpErrorException.BadRequest(err.message));
    }
  }
}

export default TodoController;
