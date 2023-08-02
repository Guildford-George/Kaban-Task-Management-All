import { AxiosError, isAxiosError } from "axios"
import ClientNotification from "../config/clientNotification"
import { ServerError } from "../utils/Interface"
type ErrorHandler= <T>(error:AxiosError,setFormError?:React.Dispatch<React.SetStateAction<T>> | null, resetState?:T | null )=> void

const useErrorHandler:ErrorHandler = (error, setFormError=null,resetState=null) => {
  try {
    if(isAxiosError(error) && error.response){
      const errorData= error.response.data as ServerError
      if(errorData.error.errors===null){
        ClientNotification.error(errorData.error.message)
      }
      else if(Array.isArray(errorData.error.errors)){
        if(setFormError!==null && resetState!==null){
  
          
          let errorTarget:{[key:string]:string}={}
          errorData.error.errors.forEach((err)=>{
            const {field,message}= err
            errorTarget[field]=message
          })
          setFormError({...resetState,...errorTarget})
          ClientNotification.error(errorData.error.message)
        }
      }
      else{
        ClientNotification.error(errorData.message)
      }
    }
    else ClientNotification.error("Check connection")
  } catch (error) {
    ClientNotification.error("Something went wrong")
  }
  
}

export default useErrorHandler