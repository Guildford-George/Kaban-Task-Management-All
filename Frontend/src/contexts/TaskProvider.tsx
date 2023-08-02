import {createContext,useState} from 'react'
import {Column, Task, TaskProviderContext} from "../utils/Interface"

export const initialContext= createContext({} as TaskProviderContext)
const TaskProvider = ({children,task}:{children:React.ReactNode; task: Task}) => {
  const [targetTask, setTargetTask] = useState(task)
  return (
    <initialContext.Provider value={{targetTask,setTargetTask}}>
        {children}
    </initialContext.Provider>
  )
}

export default TaskProvider