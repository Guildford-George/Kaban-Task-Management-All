import dotenv from "dotenv";
import Config from "../interface/Config";
dotenv.config();

const ENV = <string>process.env["NODE_ENV"];

const development: Config = {
  PORT: <string>process.env["DEV_PORT"],
  ALLOWEDORIGIN: [
    <string>process.env["DEV_LOCAL_ORIGIN"],
  ],
  SALT: Number(<string>process.env["SALT"]),
  ACCESS_TOKEN_SECRET: <string>process.env["ACCESS_TOKEN_SECRET"],
  REFRESH_TOKEN_SECRET: <string>process.env["REFRESH_TOKEN_SECRET"],
  ACCESS_TOKEN_DURATION: <string>process.env["ACCESS_TOKEN_DURATION"],
  REFRESH_TOKEN_DURATION: <string>process.env["REFRESH_TOKEN_DURATION"],
  AUTH_REFRESH_TOKEN_NAME: <string>process.env["AUTH_REFRESH_TOKEN_NAME"],
  AUTHH_TOKEN_TYPE_NAME: <string>process.env["AUTH_TOKEN_TYPE_NAME"],
  REFRESH_TOKEN_MAXAGE: Number(<string>process.env["REFRESH_TOKEN_MAXAGE"])
};


const testing: Config = {
  PORT: <string>process.env["DEV_PORT"],
  ALLOWEDORIGIN: [
    <string>process.env["DEV_LOCAL_ORIGIN"],
    <string>process.env["DEV_DEPLOYED_ORIGIN"],
  ],
  SALT: Number(<string>process.env["SALT"]),
  ACCESS_TOKEN_SECRET: <string>process.env["ACCESS_TOKEN_SECRET"],
  REFRESH_TOKEN_SECRET: <string>process.env["REFRESH_TOKEN_SECRET"],
  ACCESS_TOKEN_DURATION: <string>process.env["ACCESS_TOKEN_DURATION"],
  REFRESH_TOKEN_DURATION: <string>process.env["REFRESH_DURATION_DURATION"],
  AUTH_REFRESH_TOKEN_NAME: <string>process.env["AUTH_REFRESH_TOKEN_NAME"],
  AUTHH_TOKEN_TYPE_NAME: <string>process.env["AUTH_TOKEN_TYPE_NAME"],
  REFRESH_TOKEN_MAXAGE: Number(<string>process.env["REFRESH_TOKEN_MAXAGE"])
};


const production: Config = {
  PORT: <string>process.env["DEV_PORT"],
  ALLOWEDORIGIN: [
    <string>process.env["DEV_LOCAL_ORIGIN"],
    <string>process.env["DEV_DEPLOYED_ORIGIN"],
  ],
  SALT: Number(<string>process.env["SALT"]),
  ACCESS_TOKEN_SECRET: <string>process.env["ACCESS_TOKEN_SECRET"],
  REFRESH_TOKEN_SECRET: <string>process.env["REFRESH_TOKEN_SECRET"],
  ACCESS_TOKEN_DURATION: <string>process.env["ACCESS_TOKEN_DURATION"],
  REFRESH_TOKEN_DURATION: <string>process.env["REFRESH_TOKEN_DURATION"],
  AUTH_REFRESH_TOKEN_NAME: <string>process.env["AUTH_REFRESH_TOKEN_NAME"],
  AUTHH_TOKEN_TYPE_NAME: <string>process.env["AUTH_TOKEN_TYPE_NAME"],
  REFRESH_TOKEN_MAXAGE: Number(<string>process.env["REFRESH_TOKEN_MAXAGE"])
};

let config: Config | null = null;
switch (ENV) {
  case "development":
    config = development;
    break;
  case "testing":
    config = testing;
    break;
  case "production":
    config = production;
    break;
}

export default config;
