import {toast, ToastOptions} from "react-toastify"

export default class ClientNotification{
    static error(message:string){
        return toast.error(message, ClientNotification.config)
    }

    static info(message:string){
        return toast.info(message, ClientNotification.config)
    }

    static success(message:string){
        return toast.success(message, ClientNotification.config)
    }

    static config:ToastOptions={
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    }


}