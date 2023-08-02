export const ERRORMESSAGE = {
  
  // Auth
  emptyEmail: "email can not be empty",
  invalidEmail: "provide a valid email",
  emptyPassword: "password can not be empty",
  invalidPassword: "Provide a password",
  weakPassword: "Provide a strong password",
  loginError: "login Validation Error",
  invalidAccount: "Account does not exist",
  unmatchPassword: "Incorrect Password",

  // Board
  addBoardError: "Validation Error - New Board",
  editBoardError: "Validation Error - Edit Board",
  emptyBoardName: "board name can be empty",
  invalidBoardName: "provide a valid board name",
  duplicationBoardName: "Board name already exist",
  duplicationColumnNames: "Columns name must be unique",
  invalidColumnsData: "Invalid Column field data",
  invalidBoardTarget: "Board does not exist",
  editBoardDuplicateColumnNames: "Provide a valid column name for alrady saved column",
  
  // Column
  addColumnError: "Validation Error- New/Update Column",
  invalidColumnName: "Column name must be alphabet",
  invalidColumn: "Column does not exist",
  duplicateColumnName: "Column name already exist",
  emptyColumnName: "Column name can not be empty",
  invalidColumName: "provide a valid Column name",
  
  // Task
  addTaskError: "Validation Error- New/Update task",
  emptyTaskName: "task name can not be empty",
  invalidTaskName: "provide a valid task name",
  duplicationTaskName: "task name already exist",
  invalidTaskTarget: "Task does not exist",
  invalidSubtasksData: "Invalid Subtask field data",
  emptySavedSubtaskField: "Already saved subtasks field can not be empty",

  // Subtask
  invalidSubtaskTarget:"Subtask does not exist",

  // Common
  invalidInput: "provide a valid data",
  unauthenticated: "Provide Bearer Token",
  unauthorized: "Not authorized to make request",
  invalidToken: "Token is either invalid or has expired",
  sessionEnded: "Session has ended",
};

export const SUCCESSMESSAGE = {
  sucessfulLogin: "login sucessful",
  successfulNewBoard: "new board was successfully added",
  successfulNewTask: "new task was successfully added",
  successfulaccessTokenRefreshed: "Access token successfully refreshed",
  succesfulaccountVerification:"Account verified",
  // USER
  getUserBoards: "List of boards",
  getBoardColumn: "List of columns",
  updateColumnName: "Column name updated successfully",
  createNewColumn: "New column created successfully",
  boardDeleted: "Board successfully deleted",
  columnDeleted: "Board successfully deleted",
  taskDeleted: "Task successfully deleted",
  successfulBoardEdit: "Board has been updated successfully",
  successfulTaskEdit: "Task has been updated successfully",
  successfulDoneEdit: "Subtask has been updated successfully",
  successfulSubtaskDelete: "Subtask has been successfully deleted",
  successfulColumnFetch: "Column details",
  successfulTaskFetch: "Task details",
  successfulTasksFetch: "List of task",
  successfulsubtasksFetch: "List of subtasks",
  successfulsubtaskFetch: "Subtask details",
  successfulboardFetch: "Board details",
};

export const LOGGERMESSAGE = {
  // Error
  unsuccessfulLogin: "Error trying to log in",
  unsuccessfullNewBoard: "Error trying to create new board",
  unsuccessfullNewTask: "Error trying to create new task",
  unauthenticatedUser: "User not unauthenticated",
  unauthorizedUser: "Account not unauthorized",
  userSessionEnded: "Account session has ended",
  unsuccessfulColumnNameChange: "Error trying to change Column name",
  unsuccessfulNewColumn: "Error trying to create new column",
  unsucessfulDeleteTask: "Error tring to delete task",
  unsucessfulDeleteBoard: "Error tring to delete board",
  unsucessfulDeleteColumn: "Error tring to delete column",
  unsuccessfulFetchColumn: "Error trying to fetch column data",
  unsuccessfulFetchColumns: "Error trying to fetch column data",
  unsuccessfulFetchTask: "Error trying to fetch task data",
  unsuccessfulFetchBoard: "Error trying to fetch board data",
  unsuccessfulFetchTasks: "Error trying to fetch tasks in a column",
  unsuccessfulFetchBoardColumn: "Error trying to fetch board columns",
  unsuccessfulUpdateBoard: "Error trying to edit board",
  unsuccessfulUpdateTask: "Error trying to edit board",
  unsuccessfulUpdateDoneStatus: "Error trying to subtask done status",
  unsuccessfulDeleteSubtask: "Error trying to subtask done status",
  unsuccessfulGetSubtask: "Error trying to fetch subtask data",
  unsuccessfulGetSubtasks: "Error trying to fetch task subtasks",
  // Success
};

