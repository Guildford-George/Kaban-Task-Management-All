import useColumnTarget from "../../hooks/ContextHooks/useColumnTarget"
import useAPIRequest from "../../hooks/useAPIRequest"
import ModalSetup from "../ModalSetup"

const DeleteColumn = ({setShowModal}:{setShowModal:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {deleteColumn}= useAPIRequest()
  const {columnName}= useColumnTarget().targetColumn
  return (
    <ModalSetup setShowModal={setShowModal}>
        <div className="delete">
            <h3>Delete this Column?</h3>
            <p className="notification-message">Are you sure you want to delete the <strong style={{textTransform: "capitalize"}}>{columnName}</strong> columns? This action will remove all tasks and subtasks and cannot be reversed.</p>
            <div className="button-group">
                <button className="btn danger-btn" onClick={()=>{deleteColumn(setShowModal)}}>Delete</button>
                <button className="btn neutral-btn" onClick={()=>setShowModal(false)}>Cancel</button>
            </div>
        </div>
    </ModalSetup>
  )
}

export default DeleteColumn