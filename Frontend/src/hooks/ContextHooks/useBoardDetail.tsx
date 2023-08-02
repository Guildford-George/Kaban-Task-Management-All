import {useContext} from 'react'
import { activeBoardInitial } from '../../contexts/ActiveBoardProvider'

const useBoardDetail = () => {
  return  useContext(activeBoardInitial)
}

export default useBoardDetail