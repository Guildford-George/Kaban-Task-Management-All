import {useState} from "react"
import { MdOutlineModeEditOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import TaskCard from "./TaskCard";
import useColumnTarget from "../hooks/ContextHooks/useColumnTarget";
import DeleteColumn from "./Modals/DeleteColumn";
const ColumnCard = ({colorIcon}:{colorIcon:string}) => {
  const [showModal, setShowModal] = useState(false)
  const {targetColumn}=useColumnTarget()
  const {columnName, tasks}= targetColumn
  
  return (
    <>
      <div className="column-card">
        <div className="card-head flexSB-center">
          <div className="card-info">
            <div className="card-bullet" style={{ backgroundColor: colorIcon }}></div>
            <p className="card-name">{columnName} ({tasks.length})</p>
          </div>
          <div className="card-action">
            <button className="icon" title="Edit Column name">
              <MdOutlineModeEditOutline />
            </button>
            <button className="icon" title="Delete column" onClick={()=>setShowModal(true)}>
              <IoClose />
            </button>
          </div>
        </div>
        <div className="card-body">
          {
            tasks.map((task)=>{
              return <TaskCard key={task.taskId} task={task}/>
            })
          }
          
        </div>
      </div>
      {
        showModal && <DeleteColumn setShowModal={setShowModal}/>
      }
    </>
    
  );
};

export default ColumnCard;
