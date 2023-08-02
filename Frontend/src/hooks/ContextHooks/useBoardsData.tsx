import {useContext} from 'react'
import { userDataInitial } from '../../contexts/UserDataProvider'
const useBoardsData = () => {
  return useContext(userDataInitial)
}

export default useBoardsData