import {useState,useEffect} from 'react'
import { API_Instance, HTTPClientService } from '../config/backendConfig'
import useAuth from './ContextHooks/useAuth'
import useBoardsData from './ContextHooks/useBoardsData'
import { useNavigate, useParams } from 'react-router-dom'

const useMainData = () => {
  const [fetchBoards, setFetchBoards] = useState(false)

  const navigate= useNavigate()
  const {setUserBoards, userBoards}= useBoardsData()
  const {user}= useAuth()
  const {id}= useParams()
  useEffect(()=>{
    if(user && user!==null){

        (
            async ()=>{
              try {
                const response = await HTTPClientService(API_Instance,"/boards", "GET")
                const serverResponse= response?.data.data
                setUserBoards(serverResponse.items)
                // if(!id){
                //     navigate(`/boards/${userBoards[0].boardId}`)
                // }
                // else{navigate(`/boards/${id}`)}

              } catch (error) {
                console.log(error)
              }
            }
          )()

        console.log("start")
    }
   
  },[user, fetchBoards])
  return {setFetchBoards}
}

export default useMainData