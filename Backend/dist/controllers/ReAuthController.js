"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralUtils_1 = require("../utils/GeneralUtils");
const Response_1 = __importDefault(require("../utils/Response"));
const message_1 = require("../constant/message");
const http_status_codes_1 = require("http-status-codes");
/**
 * Refresh Access Token
 */
const refreshAccessToken = (req, res, next) => {
    try {
        const token = (0, GeneralUtils_1.generateAccessToken)(req.payload);
        const { loginId, role } = req.payload;
        const response = {
            user: { loginId, role },
            token,
        };
        return Response_1.default.sendSuccess(res, message_1.SUCCESSMESSAGE.successfulaccessTokenRefreshed, http_status_codes_1.StatusCodes.OK, {
            item: response,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = refreshAccessToken;
//# sourceMappingURL=ReAuthController.js.map