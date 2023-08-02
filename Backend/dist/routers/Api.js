"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReAuth_1 = __importDefault(require("./API/ReAuth"));
const User_1 = __importDefault(require("./API/User"));
const Admin_1 = __importDefault(require("./API/Admin"));
const Api = (0, express_1.Router)();
Api.use("/re-auth", ReAuth_1.default);
Api.use("/user", User_1.default);
Api.use("/admin", Admin_1.default);
exports.default = Api;
//# sourceMappingURL=Api.js.map