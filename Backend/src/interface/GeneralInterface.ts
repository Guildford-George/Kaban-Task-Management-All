export interface Payload {
  loginId: string;
  role: string;
  tokenType: string;
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}



export interface RelationalTableSaveBoard{
    board: BoardAdd
    columns: Column[]
    
}

export interface RelationalTableSaveTask{
  task: TaskAdd
  subtasks: Subtask[]
}
export interface BoardAdd{
    boardName: string;
    createdBy: string;
}

export interface Column{
   columnName: string;
   itemOrder: number;
}

export interface TaskAdd{
    title: string;
    description: string;
    itemOrder: number 
}

export interface Subtask{
  title: string; 
}


export interface MoveTaskData{
  destination: {columnId: string, index: number, taskId:string};
  source: {columnId: string, index: number, taskId:string}
}