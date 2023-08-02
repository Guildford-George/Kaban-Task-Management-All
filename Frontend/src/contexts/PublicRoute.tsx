import {useEffect} from 'react'
import useAuth from '../hooks/ContextHooks/useAuth'
import useBoardsData from '../hooks/ContextHooks/useBoardsData'
import { Navigate, useNavigate } from 'react-router-dom'

const PublicRoute = ({children}: {children:React.ReactNode}) => {
    const {user}= useAuth()
    const {userBoards}=useBoardsData()
    const navigate= useNavigate()
    // useEffect(()=>{
    //     navigate("/")
    // },[userBoards])
  if(user===null){
    return children
  }
  else if (user){
    const firstBoard= userBoards[0].boardId
    return <Navigate to={`/boards/${firstBoard}`}/>
  }
}

export default PublicRoute