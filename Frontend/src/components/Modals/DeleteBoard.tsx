import React from 'react'
import ModalSetup from '../ModalSetup'
import useAPIRequest from '../../hooks/useAPIRequest'
import useBoardDetail from '../../hooks/ContextHooks/useBoardDetail'
import { BoardType } from '../../utils/Interface'

const DeleteBoard = ({setShowModal}:{setShowModal:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {deleteBoard}= useAPIRequest()
  const {boardName}= useBoardDetail().boardDetail as BoardType
  return (
    <ModalSetup setShowModal={setShowModal}>
        <div className="delete">
            <h3>Delete this Board?</h3>
            <p className="notification-message">Are you sure you want to delete the <strong style={{textDecoration: "capitalize"}}>{boardName}</strong> board? This action will remove all columns and tasks and cannot be reversed.</p>
            <div className="button-group">
                <button className="btn danger-btn" onClick={()=>{deleteBoard(setShowModal)}}>Delete</button>
                <button className="btn neutral-btn" onClick={()=>setShowModal(false)}>Cancel</button>
            </div>
        </div>
    </ModalSetup>
  )
}

export default DeleteBoard