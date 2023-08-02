import { createContext, useState,useEffect } from "react";
import { BoardType, UserDataContext } from "../utils/Interface";
import useAuth from "../hooks/ContextHooks/useAuth";
import { API_Instance, HTTPClientService } from "../config/backendConfig";

export const userDataInitial = createContext({} as UserDataContext);
const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [userBoards, setUserBoards] = useState<BoardType[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [reload, setReload] = useState(false)
  const {user}=useAuth()

  useEffect(()=>{
    console.log("start")
    if(user || reload===true){
        (
            async ()=>{
              try {
                const response = await HTTPClientService(API_Instance,"/boards", "GET")
                const allBoard= response?.data.data.items
                setUserBoards(allBoard)
                setIsLoading(false)
                setReload(false)
              } catch (error) {
                console.log(error)
              }
            }
          )()
    }
  },[user,reload])
  return (
    <userDataInitial.Provider value={{ userBoards, setUserBoards,setReload }}>
      {
        user===null? children :
        isLoading? (
            <h1>Fetching Board</h1>
        ): userBoards.length>0? children: <h1>you don't have boards</h1>
      }
    </userDataInitial.Provider>
  );
};

export default UserDataProvider;
