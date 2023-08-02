import { useContext } from "react";
import { initialContext } from "../../contexts/TaskProvider";

export const useTaskProvider = () => {
  return useContext(initialContext);
};
