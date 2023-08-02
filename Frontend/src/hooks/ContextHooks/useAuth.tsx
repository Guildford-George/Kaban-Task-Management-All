import {useContext} from 'react'
import { userInitialContext } from '../../contexts/UserAuthProvider'
const useAuth = () => {
  return useContext(userInitialContext)
}

export default useAuth