import { BoardType, Column, FindTargetIndex, Task } from "./Interface";

export const columnIconColor = [
  "#49C4E5",
  "#8471F2",
  "#364ec6",
  "#1cc939",
  "#f01054",
  "#f9b200",
  "#009184",
];

export const initialLoginStateValue= {
  email:"",
  password: ""
}
export const getAccessToken= ()=>{
  return localStorage.getItem("KTA_accessToken")
}


export const setAccessToken= (token:string)=>{
  return localStorage.setItem("KTA_accessToken", token)
}

export const findTargetIndex: FindTargetIndex= (targetName, targetValue, arr)=>{
  
  return arr.findIndex((value:{[key:string]:string})=>value[targetName]===targetValue)
}