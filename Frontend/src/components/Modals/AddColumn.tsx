import { useState } from "react"
import ModalSetup from "../ModalSetup"
import useAPIRequest from "../../hooks/useAPIRequest"

const AddColumn = ({setShowModal}:{setShowModal:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const [name, setName] = useState("")
  const {addColumn}= useAPIRequest()
    return (
    <ModalSetup setShowModal={setShowModal}>
        <form action="" onSubmit={(e)=>{e.preventDefault(); addColumn({name},setShowModal)}}>
          <h3 className="form-head">Add New Column</h3>
  
          <div className="form-content">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                id="name"
                placeholder="e.g. Progress Stage"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <button className="form-btn primary-btn">Create Board</button>
          </div>
        </form>
      </ModalSetup>
  )
}

export default AddColumn