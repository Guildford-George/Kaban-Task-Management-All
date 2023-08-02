import {useState} from "react"
import { useTaskProvider } from "../hooks/ContextHooks/useColumnTaskProvider";
import { Task } from "../utils/Interface";
import ViewTask from "./Modals/ViewTask";
import TaskProvider from "../contexts/TaskProvider";

const TaskCard = ({ task }: { task: Task  }) => {
  const [showViewTask, setShowViewTask] = useState(false)

  const { title, subtasks } = task;

  const {setTargetTask}= useTaskProvider()
  const doneStat = subtasks.filter((subtask) => subtask.done).length;
  const subtaskdescription =
    subtasks.length == 0
      ? "0 of 0 subtask"
      : doneStat + " of " +subtasks.length +" " +
        (subtasks.length == 1 ? "subtask" : "subtasks");

  return (
    <>
      <TaskProvider task={task}>

        <div className="task-card" onClick={()=>{setShowViewTask(true)}}>
          <p className="task-title">{title}</p>
          <p className="subtask-stat">{subtaskdescription}</p>
        </div>

        {
          showViewTask &&
          <ViewTask setShowModal={setShowViewTask}/>
        }
      </TaskProvider>
    </>
  );
};

export default TaskCard;
