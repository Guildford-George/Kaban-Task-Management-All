import React from 'react'
import useAuth from '../hooks/ContextHooks/useAuth'
import { Navigate } from 'react-router-dom'


const RoleAuth = ({children}: {children:React.ReactNode}) => {
    const {user}= useAuth()
  if(!user || user===null){
    return <Navigate to="/login"/>
  }
  else if(user.role==="USER"){
    return children
  }
}

export default RoleAuth