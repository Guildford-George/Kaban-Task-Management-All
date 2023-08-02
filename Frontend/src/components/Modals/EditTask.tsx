import {useState} from "react"
import ModalSetup from "../ModalSetup"
import {IoClose} from "react-icons/io5"
import {BiChevronDown} from "react-icons/bi"
import CustomSelectOption from "../CustomSelectOption";
import { useTaskProvider } from "../../hooks/ContextHooks/useColumnTaskProvider";
import useColumnTarget from "../../hooks/ContextHooks/useColumnTarget";

const EditTask = ({setShowModal}:{setShowModal:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {targetTask}= useTaskProvider()
  const {targetColumn}= useColumnTarget()
    const [title, setTitle] = useState(targetTask.title);
  const [description, setDescription] = useState(targetTask.description)
  const [status, setStatus] = useState({
    columnId: targetColumn.columnId,
    columnName: targetColumn.columnName
  })

  const [showOption, setShowOption] = useState(false)
  
    return (
    <ModalSetup setShowModal={setShowModal}>
      <form action="">
        <h3 className="form-head">Add New Task</h3>

        <div className="form-content">
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              id="title"
              placeholder="e.g. Take coffee break"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <div className="textarea">
                <textarea
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                name="description"
                id="description"
                cols={30}
                rows={4}
                placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."></textarea>      
            </div>
          </div>
          <div className="group-field">
            <label htmlFor="subtasks">Subtasks</label>
            <div className="form-field form-field-flex">
                <input type="text" name="" id="" placeholder="e.g. Make coffee"/>
                <span className="icon"><IoClose /></span>
            </div>
            <div className="form-field form-field-flex">
                <input type="text" name="" id="" placeholder="e.g. Make coffee"/>
                <span className="icon"><IoClose /></span>
            </div>
          <span className="form-btn neutral-btn">+ Add New Subtask</span>
          </div>
          <div className="form-field selector">
            <div className="selected-label" onClick={()=>setShowOption(true)}>Status</div>
            <div className="selected-options flexSB-center" onClick={()=>setShowOption(!showOption)}>
                <span className="opt-name">{status.columnName}</span>
                <span className="icon"><BiChevronDown /></span>
            </div>
            {
                showOption &&
                <CustomSelectOption setter={setStatus} setShowOption={setShowOption}/>
            }
          </div>
          <button className="form-btn primary-btn">Create Task</button>
        </div>
      </form>
    </ModalSetup>
  )
}

export default EditTask