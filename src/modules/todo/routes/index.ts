import { Router } from "express";
import TodoController from "../controllers/TodoController";
import TodoRepository from "../repository/todo.repository";
import TodoService from "../services/TodoService";

const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

const router = Router();

router.post("/", todoController.createTodo);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);
router.get("/:id", todoController.getTodo);
router.get("/", todoController.getTodos);

export default router;
