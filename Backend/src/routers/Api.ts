import { Router } from "express";
import ReAuth from "./API/ReAuth";
import User from "./API/User";
import Admin from "./API/Admin";

const Api= Router()

Api.use("/re-auth", ReAuth)
Api.use("/user", User)
Api.use("/admin", Admin)

export default Api