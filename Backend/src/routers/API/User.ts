import { Router } from "express";
import { Authorization } from "../../middlewares/Authorization";
import { RoleAuthorization } from "../../middlewares/Role";
import UserController from "../../controllers/UserController";
import UserEditUpdateController from "../../controllers/EditUpdateController";

const User = Router();

User.use(
  Authorization.AccessTokenVerification,
  RoleAuthorization.Verify("USER")
);

// Boards
User.get("/boards", UserController.GetBoards);
User.get("/boards/:boardId", UserController.GetBoard)
User.post("/boards", UserController.AddBoard);
User.get("/boards/:boardId/column", UserController.GetColumns);
User.post("/boards/:boardId/column", UserController.AddColumn);
User.put("/boards/:boardId", UserEditUpdateController.EditBoard);
User.delete("/boards/:boardId", UserController.DeleteBoard);

// Columns
User.get("/columns/:columnId", UserController.GetColumn);
User.get("/columns/:columnId/task", UserController.GetTasks);
User.post("/columns/:columnId/task", UserController.AddTask);
User.put("/columns/:columnId", UserEditUpdateController.EditColumnName);
User.delete("/columns/:columnId", UserController.DeleteColumn);

// Task
User.get("/tasks/:taskId", UserController.GetTask);
User.get("/tasks/:taskId/subtask", UserController.GetSubtasks);
User.put("/tasks/:taskId", UserEditUpdateController.EditTask);
User.delete("/tasks/:taskId", UserController.DeleteTask);

// Subtask
User.get('/subtasks/:subtaskId', UserController.GetSubtask)
User.put(
  "/subtasks/:subtaskId/done",
  UserEditUpdateController.UpdateSubtaskDone
);
User.delete("/subtasks/subtaskId", UserController.DeleteSubtask);
export default User;
