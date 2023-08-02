import { useEffect, useState } from "react";
import { Auth_Instance, HTTPClientService } from "../config/backendConfig";
import useErrorHandler from "./useErrorHandler";
import Login from "../pages/Login";
import ClientNotification from "../config/clientNotification";
import { setAccessToken } from "../utils/GeneralUtils";
import useAuth from "./ContextHooks/useAuth";
import useData from "./ContextHooks/useData";
type Login= {email:string;password:string}

const useLogin= (signIn:Login, setSignInError: React.Dispatch<React.SetStateAction<Login>>, resetState:Login) => {
    const [submit, setSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const {setUser}= useAuth()
    const {setReload}= useData()
  const handleLogin= async ()=>{
    try {
        
       const response= await HTTPClientService(Auth_Instance,"/login","POST",signIn)
       const serverResponse= response?.data.data
       setAccessToken(serverResponse.token)
        setUser(serverResponse.user)
        setReload(true)
       ClientNotification.success(serverResponse.message)
       console.log("done")
    } catch (error:any) {
        useErrorHandler(error,setSignInError,resetState)
    }
    setSubmit(false)
  }
  useEffect(()=>{
       if(submit){
            handleLogin()
       } 
  },[submit])

  return {isLoading, setIsLoading,submit, setSubmit}
}

export default useLogin