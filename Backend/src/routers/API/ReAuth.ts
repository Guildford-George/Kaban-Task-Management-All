import { Router } from "express";
import refreshAccessToken from "../../controllers/ReAuthController";

const ReAuth= Router()

ReAuth.post("/", refreshAccessToken)

export default ReAuth
