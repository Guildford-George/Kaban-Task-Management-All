import {useContext} from "react"
import { userDataInitial } from "../../contexts/UserDataProvider"

const useData = () => {
  return useContext(userDataInitial)
}

export default useData