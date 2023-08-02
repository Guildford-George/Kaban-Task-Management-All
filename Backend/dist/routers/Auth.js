"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const Auth = (0, express_1.Router)();
Auth.post("/login", AuthController_1.default.Login);
Auth.post("/reset", AuthController_1.default.Reset);
exports.default = Auth;
//# sourceMappingURL=Auth.js.map