import { AxiosInstance, AxiosResponse } from "axios";
import React from "react";

export type FindTargetIndex= <T,>(targetName: "boardId" | "columnId" | "taskId" | "subtaskId", targetValue:string, arr: any)=>number

export interface Theme{
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
}

export type HTTPService = (
  instance: AxiosInstance,
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  requestData?: Object,
  searchQuery?: string
) => Promise<AxiosResponse | undefined>;

export interface ServerError {
  status: string;
  code: number;
  message: string;
  time: Date;
  error: {
    type: string;
    message: string;
    errors: { [key: string]: string }[] | MultiNameError | null
  };
}

export interface MultiNameError {
  duplicateFields?: number[][];
  invalidField?: number[];
}
export interface Modal {
  children: React.ReactNode;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CustomSelectionOption {
  setter: React.Dispatch<React.SetStateAction<{columnId: string, columnName:string}>>;
  setShowOption: React.Dispatch<React.SetStateAction<boolean>>
}

// export interface SelectOption {
//   taskId?: string;
//   title: string;
//   subtaskId?: string;
//   columnId?: string;
//   columnName?: string;
// }

export interface Task {
  taskId: string;
  title: string;
  description: string;
  subtasks: Subtask[];
}

export interface Column {
  columnId: string;
  columnName: string;
  tasks: Task[];
}

export interface Subtask {
  subtaskId: string;
  title: string;
  done: boolean;
}

export interface BoardType {
  boardId: string;
  boardName: string;
  columns: Column[];
}

export interface TaskProviderContext {
  targetTask: Task;
  setTargetTask: React.Dispatch<React.SetStateAction<Task>>;
}

export type NullUndefined = null | undefined;

export interface UserContext{
  user: User | NullUndefined,
  setUser: React.Dispatch<React.SetStateAction<User | NullUndefined>>
}

export interface UserDataContext{
  userBoards : BoardType[];
  setUserBoards: React.Dispatch<React.SetStateAction<BoardType[]>>
  setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ActiveBoardContext{
  boardDetail: BoardType | NullUndefined;
  setBoardDetail:React.Dispatch<React.SetStateAction<BoardType | NullUndefined>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ColumnLocationContext{
  targetColumn: Column
  setTargetColumn: React.Dispatch<React.SetStateAction<Column>>
}
export interface User{
  firstname: string;
  lastname: string;
  email: string;
  loginId: string;
  role: string
}



// formDatas
export interface AddTaskFormData{
  title: string;
  description: string;
  subtasks: string[];
}