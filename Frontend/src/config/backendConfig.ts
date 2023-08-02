import axios, {AxiosError,AxiosResponse} from "axios";
import env from "./envConfig";
import { getAccessToken } from "../utils/GeneralUtils";
import { HTTPService } from "../utils/Interface";

console.log(env.BASE_URL)
export const Auth_Instance = axios.create({
  baseURL: `${env.BASE_URL}/auth`,
});
Auth_Instance.interceptors.request.use(async (request)=>{
  const token = getAccessToken()
  if(token!==null){

    if(request.url && request.url==="/reauth" ){
      request.headers.Authorization= "Bearer "+ token
    }
  }
  return request
}, async (error)=>{
  return error
})

export const API_Instance = axios.create({
  baseURL: env.BASE_URL + "/api/v1/user",
});

const API_RequestInterceptor=  API_Instance.interceptors.request.use(async (request)=>{
    const token = getAccessToken()
    request.headers.Authorization= "Bearer "+ token
    return request
},
async (error)=>{
    return error
})

export const HTTPClientService:HTTPService=async (instance, endpoint, method, requestData) => {
  try {
    let response: AxiosResponse | undefined;
    if (method === "GET") {
      response = await instance.get(endpoint);
    }else if (method === "DELETE") {
      response = await instance.delete(endpoint);
    } else if (method === "POST") {
      response = await instance.post(endpoint, requestData);
    } else if (method === "PUT") {
      response = await instance.put(endpoint, requestData);
    }
    return response
  } catch (error) {
    throw error
  }
};