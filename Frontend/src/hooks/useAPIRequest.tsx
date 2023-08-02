import { useNavigate } from "react-router-dom"
import { API_Instance, HTTPClientService } from "../config/backendConfig"
import { findTargetIndex } from "../utils/GeneralUtils"
import { AddTaskFormData, BoardType, Column } from "../utils/Interface"
import useBoardDetail from "./ContextHooks/useBoardDetail"
import useBoardsData from "./ContextHooks/useBoardsData"
import Board from "../components/Board"
import { useTaskProvider } from "./ContextHooks/useColumnTaskProvider"
import useColumnTarget from "./ContextHooks/useColumnTarget"

const useAPIRequest = () => {
    const {boardDetail,setBoardDetail}= useBoardDetail()
    const {userBoards,setUserBoards}= useBoardsData()
    const {targetTask}= useTaskProvider()
    const {targetColumn,setTargetColumn}= useColumnTarget()
    const navigate= useNavigate()

    const addBoard= async (formData: {name: string; columns: string[]}, setShowModal:React.Dispatch<React.SetStateAction<boolean>>)=>{
        try {
            const response = await HTTPClientService(API_Instance, "/boards","POST", formData)
            const item= response?.data.data.item as BoardType
            setUserBoards([item,...userBoards])
            navigate(`/boards/${item.boardId}`)
            setShowModal(false)
        } catch (error) {
            console.log(error)
        }
    }
    const deleteBoard= async (setShowModal:React.Dispatch<React.SetStateAction<boolean>>)=>{
        try {
            await HTTPClientService(API_Instance, `/boards/${boardDetail?.boardId}`,"DELETE")
            const index=findTargetIndex("boardId",boardDetail?.boardId as string,userBoards)
            setUserBoards((prev)=>{
                prev.splice(index, 1)
                return [...prev]
            })
            navigate(`/boards/${userBoards[0].boardId}`)
            setShowModal(false)
        } catch (error) {
            
        }
    }

    // columnd
    const addColumn= async (formData: {name:string}, setShowModal: React.Dispatch<React.SetStateAction<boolean>>)=>{
        try {
            const response= await HTTPClientService(API_Instance,`/boards/${boardDetail?.boardId}/column`,"POST", formData)
            const column= response?.data.data.item.column
            setBoardDetail((prev)=>{
                const board= prev as BoardType
                board.columns.push(column)
                return {...board}
            })
            setShowModal(false)
        } catch (error) {
            console.log(error);
            
        }
    }

    const deleteColumn= async (setShowModal: React.Dispatch<React.SetStateAction<boolean>>)=>{
        try {
            console.log("ok");
            console.log(targetColumn);
            
            await HTTPClientService(API_Instance, `/columns/${targetColumn.columnId}`, "DELETE")
            setBoardDetail((prev)=>{
                const board= prev as BoardType
                const index= findTargetIndex("columnId", targetColumn.columnId,board.columns)
                board.columns.splice(index,1)
                return {...board}
            })
            setShowModal(false)

        } catch (error) {
            console.log(error)
        }
    }
    // task
    const addTask= async(formData:AddTaskFormData, status: {columnId: string, columnName: string}, setShowModal: React.Dispatch<React.SetStateAction<boolean>>)=>{
        try {
            const response= await HTTPClientService(API_Instance,`columns/${status.columnId}/task`,"POST", formData)
            const item= response?.data.data.item
            
            setBoardDetail((prev)=>{
                const index= findTargetIndex("columnId",status.columnId,boardDetail?.columns)
                const board= prev as BoardType
                console.log(board)
                board.columns[index].tasks.unshift(item)
                return {...board}
            })
            // console.log(item)
            setShowModal(false)
        } catch (error) {
            console.log(error);
            
        }
    }

    const deleteTask = async (setShowModal:React.Dispatch<React.SetStateAction<boolean>>, setParentModal:React.Dispatch<React.SetStateAction<boolean>>)=>{
        try {
            await HTTPClientService(API_Instance,`/tasks/${targetTask.taskId}`, "DELETE")
            console.log(targetColumn);
            
            setTargetColumn((prev)=>{
                const index = findTargetIndex("taskId",targetTask.taskId, targetColumn.tasks)
                console.log(index)
                prev.tasks.splice(index, 1)
                console.log(prev);
                return {...prev}
            })
            setShowModal(false)
            setParentModal(false)
        } catch (error) {
            
        }
    }
  return {deleteBoard,addBoard,addColumn, deleteColumn,addTask, deleteTask}
}

export default useAPIRequest