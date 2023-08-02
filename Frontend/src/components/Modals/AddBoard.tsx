import {useState} from "react"
import ModalSetup from "../ModalSetup";
import {IoClose} from "react-icons/io5"
import { findTargetIndex } from "../../utils/GeneralUtils";
import useAPIRequest from "../../hooks/useAPIRequest";

const AddBoard = ({setShowModal}:{setShowModal:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {addBoard}=useAPIRequest()
    const [formData, setFormData] = useState({
      name: "",
      columns: [""]
    })

    const handleNewColumn= ()=>{
      const columns= formData.columns
      columns.push("")
      setFormData({...formData, columns})
    }

    const handleColumnDelete= (index:number)=>{
      const columns= formData.columns
      columns.splice(index,1)
      setFormData({...formData, columns})
    }

    const handleColumnChange= (value:string,index:number)=>{
      const columns=formData.columns
      columns[index]= value
      setFormData({...formData,columns})
    }
    return (
      <ModalSetup setShowModal={setShowModal}>
        <form action="">
          <h3 className="form-head">Add New Board</h3>
  
          <div className="form-content">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                id="name"
                placeholder="e.g. Web Design"
                onChange={(e)=>setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="group-field">
              <label htmlFor="columns">Columns</label>
              {
                formData.columns.map((column,index)=>{
                  return (
                    <div className="form-field form-field-flex" key={index}>
                      <input type="text" name="" id="columns" placeholder="e.g. Progress" value={column} onChange={(e)=>handleColumnChange(e.target.value,index)}/>
                      <span className="icon" onClick={()=>handleColumnDelete(index)}><IoClose /></span>
                  </div>
                  )
                })
              }
            <span className="form-btn neutral-btn" onClick={()=>handleNewColumn()}>+ Add New Column</span>
            </div>
            <button className="form-btn primary-btn" onClick={(e)=>{e.preventDefault(); addBoard(formData, setShowModal)}}>Create Board</button>
          </div>
        </form>
      </ModalSetup>
    );
}

export default AddBoard