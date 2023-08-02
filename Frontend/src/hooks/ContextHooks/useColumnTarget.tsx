import {useContext} from 'react'
import { columnLocationInitial } from '../../contexts/ColumnLocation'

const useColumnTarget = () => {
  return useContext(columnLocationInitial)
}

export default useColumnTarget