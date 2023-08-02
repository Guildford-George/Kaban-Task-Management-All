import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { Authorization } from "../middlewares/Authorization";
import { RoleAuthorization } from "../middlewares/Role";

const Auth = Router();

Auth.post("/login", AuthController.Login);
Auth.post("/reset", AuthController.Reset);
Auth.post(
  "/reauth",
  Authorization.AccessTokenVerification,
  AuthController.ReAuth
);
Auth.post("/reauth/refresh",Authorization.RefreshTokenSession, AuthController.RefreshAccessToken)

export default Auth;
