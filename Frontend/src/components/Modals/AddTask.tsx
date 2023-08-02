import { useState } from "react";
import ModalSetup from "../ModalSetup";
import CustomSelectOption from "../CustomSelectOption";
import {IoClose} from "react-icons/io5" 
import { BiChevronDown } from "react-icons/bi";
import { AddTaskFormData } from "../../utils/Interface";
import useBoardDetail from "../../hooks/ContextHooks/useBoardDetail";
import useAPIRequest from "../../hooks/useAPIRequest";



const AddTask = ({setShowModal}: {setShowModal: React.Dispatch<React.SetStateAction<boolean>>;}) => {
  const {boardDetail}= useBoardDetail()
  const {addTask}= useAPIRequest()
  const [status, setStatus] = useState({
    columnId: boardDetail?.columns[0].columnId as string,
    columnName: boardDetail?.columns[0].columnName as string
  })
  const [showOption, setShowOption] = useState(false)
  const [formData, setFormData] = useState({subtasks:[""]} as AddTaskFormData)

  const handleAddNewSubtask= ()=>{
    const subtasks= formData.subtasks
    subtasks.push("")
    setFormData({...formData, subtasks})
  }
  const handleSubtaskChange= (value:string, index:number)=>{
    const subtasks= formData.subtasks
    subtasks[index]= value
    setFormData({...formData,subtasks})
  }

  const handleSubtaskDelete= (index:number)=>{
    const subtasks= formData.subtasks
    subtasks.splice(index,1)
    setFormData({...formData, subtasks})
  }
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
              value={formData.title}
              id="title"
              placeholder="e.g. Take coffee break"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <div className="textarea">
                <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={(e)=>setFormData({...formData, description: e.target.value})}
                cols={30}
                rows={4}
                placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."></textarea>      
            </div>
          </div>
          <div className="group-field">
            <label htmlFor="subtasks">Subtasks</label>
            {
              formData.subtasks.map((subtask,index)=>{
                return (
                  <div className="form-field form-field-flex" key={index}>
                      <input type="text" name="" id="" placeholder="e.g. Make coffee" value={subtask} onChange={(e)=>handleSubtaskChange(e.target.value,index)}/>
                      <span className="icon" onClick={()=> handleSubtaskDelete(index)}><IoClose /></span>
                  </div>
                )
              })
            }
            
          <span className="form-btn neutral-btn" onClick={()=>handleAddNewSubtask()}>+ Add New Subtask</span>
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
          <button className="form-btn primary-btn" onClick={(e)=>{e.preventDefault(); addTask(formData,status,setShowModal)}}>Create Task</button>
        </div>
      </form>
    </ModalSetup>
  );
};

export default AddTask;
