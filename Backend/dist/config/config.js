"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ENV = process.env["NODE_ENV"];
const development = {
    PORT: process.env["DEV_PORT"],
    ALLOWEDORIGIN: [
        process.env["DEV_LOCAL_ORIGIN"],
        process.env["DEV_DEPLOYED_ORIGIN"],
    ],
    SALT: Number(process.env["SALT"]),
    ACCESS_TOKEN_SECRET: process.env["ACCESS_TOKEN_SECRET"],
    REFRESH_TOKEN_SECRET: process.env["REFRESH_TOKEN_SECRET"],
    ACCESS_TOKEN_DURATION: process.env["ACCESS_TOKEN_DURATION"],
    REFRESH_TOKEN_DURATION: process.env["REFRESH_TOKEN_DURATION"],
    AUTH_REFRESH_TOKEN_NAME: process.env["AUTH_REFRESH_TOKEN_NAME"],
    AUTHH_TOKEN_TYPE_NAME: process.env["AUTH_TOKEN_TYPE_NAME"],
    REFRESH_TOKEN_MAXAGE: Number(process.env["REFRESH_TOKEN_MAXAGE"])
};
const testing = {
    PORT: process.env["DEV_PORT"],
    ALLOWEDORIGIN: [
        process.env["DEV_LOCAL_ORIGIN"],
        process.env["DEV_DEPLOYED_ORIGIN"],
    ],
    SALT: Number(process.env["SALT"]),
    ACCESS_TOKEN_SECRET: process.env["ACCESS_TOKEN_SECRET"],
    REFRESH_TOKEN_SECRET: process.env["REFRESH_TOKEN_SECRET"],
    ACCESS_TOKEN_DURATION: process.env["ACCESS_TOKEN_DURATION"],
    REFRESH_TOKEN_DURATION: process.env["REFRESH_DURATION_DURATION"],
    AUTH_REFRESH_TOKEN_NAME: process.env["AUTH_REFRESH_TOKEN_NAME"],
    AUTHH_TOKEN_TYPE_NAME: process.env["AUTH_TOKEN_TYPE_NAME"],
    REFRESH_TOKEN_MAXAGE: Number(process.env["REFRESH_TOKEN_MAXAGE"])
};
const production = {
    PORT: process.env["DEV_PORT"],
    ALLOWEDORIGIN: [
        process.env["DEV_LOCAL_ORIGIN"],
        process.env["DEV_DEPLOYED_ORIGIN"],
    ],
    SALT: Number(process.env["SALT"]),
    ACCESS_TOKEN_SECRET: process.env["ACCESS_TOKEN_SECRET"],
    REFRESH_TOKEN_SECRET: process.env["REFRESH_TOKEN_SECRET"],
    ACCESS_TOKEN_DURATION: process.env["ACCESS_TOKEN_DURATION"],
    REFRESH_TOKEN_DURATION: process.env["REFRESH_TOKEN_DURATION"],
    AUTH_REFRESH_TOKEN_NAME: process.env["AUTH_REFRESH_TOKEN_NAME"],
    AUTHH_TOKEN_TYPE_NAME: process.env["AUTH_TOKEN_TYPE_NAME"],
    REFRESH_TOKEN_MAXAGE: Number(process.env["REFRESH_TOKEN_MAXAGE"])
};
let config = null;
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
exports.default = config;
//# sourceMappingURL=config.js.map