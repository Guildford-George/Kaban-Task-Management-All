"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReAuthController_1 = __importDefault(require("../../controllers/ReAuthController"));
const ReAuth = (0, express_1.Router)();
ReAuth.get("/", ReAuthController_1.default);
exports.default = ReAuth;
//# sourceMappingURL=ReAuth.js.map