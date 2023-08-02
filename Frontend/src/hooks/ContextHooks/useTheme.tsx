import {useContext} from 'react'
import { initialTheme } from '../../contexts/ThemeProvider'

const useTheme = () => {
  return useContext(initialTheme)
}

export default useTheme