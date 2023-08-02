"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = __importDefault(require("./Response"));
const http_status_codes_1 = require("http-status-codes");
const serverHealth = async (req, res, next) => {
    const message = "Server is live";
    return Response_1.default.sendSuccess(res, message, http_status_codes_1.StatusCodes.OK);
};
exports.default = serverHealth;
//# sourceMappingURL=serverHealth.js.map