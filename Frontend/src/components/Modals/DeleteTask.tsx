import { useTaskProvider } from "../../hooks/ContextHooks/useColumnTaskProvider"
import useAPIRequest from "../../hooks/useAPIRequest"
import ModalSetup from "../ModalSetup"

const DeleteTask = ({setShowModal, setParentModal}:{setShowModal:React.Dispatch<React.SetStateAction<boolean>>, setParentModal: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {deleteTask}= useAPIRequest()
  const {title}= useTaskProvider().targetTask
  return (
    <ModalSetup setShowModal={setShowModal}>
        <div className="delete">

            <h3>Delete this task?</h3>
            <p className="notification-message">Are you sure you want to delete the <strong style={{textTransform: "capitalize"}}>{title}</strong> task and its subtasks? This action cannot be reversed.</p>
            <div className="button-group">
                <button className="btn danger-btn" onClick={()=>{deleteTask(setShowModal,setParentModal)}}>Delete</button>
                <button className="btn neutral-btn" onClick={()=>{setShowModal(false)}}>Cancel</button>
            </div>
        </div>
      </ModalSetup>
  )
}

export default DeleteTask