import {useState} from "react"
import ModalSetup from "../ModalSetup"
import {IoClose} from "react-icons/io5"

const EditBoard = ({setShowModal}:{setShowModal:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [name, setName] = useState("");
    return (
    <ModalSetup setShowModal={setShowModal}>
    <form action="">
      <h3 className="form-head">Edit Board</h3>

      <div className="form-content">
        <div className="form-field">
          <label htmlFor="name">Board Name</label>
          <input
            type="text"
            name="name"
            value={name}
            id="name"
            placeholder="e.g. Web Design"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="group-field">
          <label htmlFor="subtasks">Board Columns</label>
          <div className="form-field form-field-flex">
              <input type="text" name="" id="" placeholder="e.g. Progress"/>
              <span className="icon"><IoClose /></span>
          </div>
          <div className="form-field form-field-flex">
              <input type="text" name="" id="" placeholder="e.g. Progress"/>
              <span className="icon"><IoClose /></span>
          </div>
        <span className="form-btn neutral-btn">+ Add New Column</span>
        </div>
        <button className="form-btn primary-btn">Create Board</button>
      </div>
    </form>
  </ModalSetup>
  )
}

export default EditBoard