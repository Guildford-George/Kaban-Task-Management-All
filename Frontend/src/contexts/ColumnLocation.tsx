import {createContext, useState} from 'react'
import { Column, ColumnLocationContext } from '../utils/Interface'

export const columnLocationInitial= createContext({} as ColumnLocationContext)
const ColumnLocation = ({children, column}:{children: React.ReactNode, column: Column}) => {
    const [targetColumn, setTargetColumn] = useState(column)
  return (
    <columnLocationInitial.Provider value={{targetColumn, setTargetColumn}}>
        {children}
    </columnLocationInitial.Provider>
  )
}

export default ColumnLocation