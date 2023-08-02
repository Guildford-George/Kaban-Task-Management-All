"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = void 0;
const message_1 = require("../constant/message");
const Error_1 = require("../interface/Error");
const GeneralUtils_1 = require("../utils/GeneralUtils");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const { unauthenticated, unauthorized, sessionEnded } = message_1.ERRORMESSAGE;
const { unauthenticatedUser, unauthorizedUser, userSessionEnded } = message_1.LOGGERMESSAGE;
class Authorization {
    /**
     * Validate AccessToken
     *
     */
    static async AccessTokenVerification(req, res, next) {
        try {
            const authorization = req.headers.authorization;
            if (!authorization) {
                // Bearer Token not provided
                (0, CustomError_1.default)(Error_1.ErrorType.SESSION, unauthenticated, unauthenticatedUser);
            }
            const token = authorization?.split(" ")[1];
            if (!token) {
                // Bearer was provide but with no token
                (0, CustomError_1.default)(Error_1.ErrorType.SESSION, unauthenticated, unauthenticatedUser);
            }
            const { loginId, role, tokenType } = (0, GeneralUtils_1.validateAccessToken)(token);
            req.payload = {
                loginId,
                role,
                tokenType,
            };
            next();
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Validate AccessToken
     *
     */
    static async RefreshTokenSession(req, res, next) {
        try {
            const refreshToken = req.cookies.USER_AUTH_REFRESH_TOKEN;
            if (!refreshToken) {
                (0, CustomError_1.default)(Error_1.ErrorType.SESSION, sessionEnded, userSessionEnded);
            }
            const { loginId, role, tokenType } = (0, GeneralUtils_1.validateRefreshToken)(refreshToken);
            req.payload = {
                loginId,
                role,
                tokenType,
            };
            next();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.Authorization = Authorization;
//# sourceMappingURL=Authorization.js.map