import {createContext, useState, useEffect} from 'react'
import { NullUndefined, User, UserContext } from '../utils/Interface'
import { Auth_Instance, HTTPClientService } from '../config/backendConfig'
import { getAccessToken } from '../utils/GeneralUtils'
export const userInitialContext= createContext({} as UserContext)
const UserAuthProvider = ({children}:{children:React.ReactNode}) => {
    const [user, setUser] = useState<User |NullUndefined>()

    useEffect(()=>{
        const authUser= async ()=>{
            try {
                const token= getAccessToken()
                console.log(token)
                if(token!==null){
                    const response= await HTTPClientService(Auth_Instance,"/reauth","POST")
                    const serverResponse= response?.data.data
                    setUser(serverResponse.user)
                }
                else setUser(null)
            } catch (error) {
                setUser(null)
            }
        }
        if(!user){
            authUser()
            console.log("ok")
        }
        // else if(user!==null && user!==undefined){
        //     console.log(user)
        //     console.log("ty")
        // }
    },[user])
  return (
    <userInitialContext.Provider value={{user, setUser}}>
        {
            user===undefined? (<h1>Loading</h1>): children
        }
    </userInitialContext.Provider>
  )
}

export default UserAuthProvider