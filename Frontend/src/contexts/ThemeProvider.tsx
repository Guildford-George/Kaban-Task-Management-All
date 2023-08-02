import React, { createContext, useState } from 'react'
import { Theme } from '../utils/Interface'

export const initialTheme= createContext({} as Theme)
const ThemeProvider = ({children}:{children: React.ReactNode}) => {
    const [theme, setTheme] = useState<"light" | "dark">("light")
  return (
    <initialTheme.Provider value={{theme, setTheme}}>
        {
            children
        }
    </initialTheme.Provider>
  )
}

export default ThemeProvider