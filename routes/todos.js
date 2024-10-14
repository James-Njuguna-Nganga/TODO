import express from "express";
import {
  createTodo,
  updateTodo,
  softDeleteTodo,
  fetchTodos,
} from "../controllers/todosController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", softDeleteTodo);
router.get("/", fetchTodos);

export default router;
