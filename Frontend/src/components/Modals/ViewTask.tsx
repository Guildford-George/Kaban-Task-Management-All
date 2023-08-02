import { useState } from "react"
import ModalSetup from "../ModalSetup"
import {HiOutlineDotsVertical} from "react-icons/hi"
import {MdCheckBox, MdCheckBoxOutlineBlank} from "react-icons/md"
import {AiOutlineCheck} from "react-icons/ai"
import DeleteTask from "./DeleteTask"
import { useTaskProvider } from "../../hooks/ContextHooks/useColumnTaskProvider"
import useColumnTarget from "../../hooks/ContextHooks/useColumnTarget"
import EditTask from "./EditTask"

const ViewTask = ({setShowModal}:{setShowModal:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [optMenu, setOptMenu] = useState(false)
    const [showDeleteTask, setShowDeleteTask] = useState(false)
    const [showEditTask, setShowEditTask] = useState(false)
    const {columnName}= useColumnTarget().targetColumn

    const {targetTask}= useTaskProvider()
    const {title,description,subtasks}= targetTask
    const subtaskdescription= subtasks.length>0? 
    "Subtasks ("+ subtasks.filter((subtask)=>subtask.done).length+ " of "+subtasks.length +")"
    :"No subtasks"
    // Subtasks (2 of 3)

    return (
        <>
            <ModalSetup setShowModal={setShowModal}>
                <div className="modal-container view-task">
                    <div className="task-title flexSB-center">
                        <p>{title}</p>
                        <div>
                            <button className="opt-btn icon" onClick={()=>{setOptMenu(!optMenu)}}><HiOutlineDotsVertical /></button>
                            {
                                optMenu && (
                                    <div className="menu-opt-card">
                                        <button className="menu-item" onClick={()=>{setShowEditTask(true); setOptMenu(!optMenu)}}>Edit Task</button>
                                        <button className="menu-item" onClick={()=>{setShowDeleteTask(true); setOptMenu(!optMenu)}}>Delete Task</button>
                                    </div>
                                )
                            }
                            
                        </div>

                    </div>
                    <p className="task-description">{description? description: "No description"}</p>
                    <div className="task-subtasks">
                        <p className="subtask-stat">{subtaskdescription}</p>
                        <div className="task-all-subtasks" onClick={()=>{}}>
                            {
                                subtasks.length>0 && (
                                    subtasks.map((subtask)=>{
                                        return (
                                            <div className={subtask.done? "subtask done": "subtask"}>
                                                <span className="icon">{
                                                    subtask.done? <MdCheckBox /> : <MdCheckBoxOutlineBlank />
                                                }</span>
                                                <p>{subtask.title}</p>
                                            </div>
                                        )
                                    })
                                )
                            }
                        </div>
                    </div>
                    <div className="task-status">
                        <p>Current Status</p>
                        <div className="selected-options flexSB-center">
                        <span className="opt-name">{columnName}</span>
                        <span className="icon"><AiOutlineCheck /></span>
                    </div>
                    </div>
                </div>
                
            </ModalSetup>
            {
                showDeleteTask && (
                    <DeleteTask setShowModal={setShowDeleteTask} setParentModal={setShowModal}/>
                )
            }
            {
                showEditTask &&(
                    <EditTask setShowModal={setShowEditTask}/>
                )
            }
        </>
  )
}

export default ViewTask