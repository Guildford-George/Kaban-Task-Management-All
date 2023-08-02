import express from "express";
import cors from "cors";
import config from "./config/config";
import morgan from "morgan";
import ErrorHandler from "./middlewares/ErrorHandler";
import serverHealth from "./utils/serverHealth";
import cookieParser from "cookie-parser";
import Auth from "./routers/Auth";
import Api from "./routers/Api";
const app = express();

// default app setup

app.use(
  cors({
    credentials: true
  })
);
app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routers
app.use("/auth", Auth)
app.use("/api/v1", Api)
// Server Live
app.get("/", serverHealth);


// Handle Error
app.use(ErrorHandler.HandleError)

export default app
