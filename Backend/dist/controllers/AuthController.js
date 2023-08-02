"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationSchema_1 = require("../utils/ValidationSchema");
const database_1 = __importDefault(require("../config/database"));
const message_1 = require("../constant/message");
const Error_1 = require("../interface/Error");
const GeneralUtils_1 = require("../utils/GeneralUtils");
const config_1 = __importDefault(require("../config/config"));
const Response_1 = __importDefault(require("../utils/Response"));
const http_status_codes_1 = require("http-status-codes");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const { invalidAccount, unmatchPassword } = message_1.ERRORMESSAGE;
const { unsuccessfulLogin } = message_1.LOGGERMESSAGE;
const { sucessfulLogin } = message_1.SUCCESSMESSAGE;
class AuthController {
    /**
     * Login of user
     *
     * @param req Express Request Object
     * @param res Express Response Object
     */
    static async Login(req, res, next) {
        try {
            await (0, ValidationSchema_1.loginSchmenValidation)(req);
            const { email, password } = req.body;
            const account = await database_1.default.account.findFirst({
                where: {
                    email,
                },
            });
            if (account === null) {
                // Account not found
                (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, invalidAccount, unsuccessfulLogin);
                return;
            }
            const match = await (0, GeneralUtils_1.validatePassword)(password, account.password);
            if (!match) {
                // Invalid Password
                (0, CustomError_1.default)(Error_1.ErrorType.VALIDATION, unmatchPassword, unsuccessfulLogin);
            }
            const { loginId, role } = account;
            const user = await database_1.default.user.findFirst({
                where: {
                    loginId,
                },
            });
            // Generate Session Token
            const tokenType = config_1.default?.AUTHH_TOKEN_TYPE_NAME;
            const payload = {
                loginId,
                role,
                tokenType,
            };
            const accessToken = (0, GeneralUtils_1.generateAccessToken)(payload);
            const refreshToken = (0, GeneralUtils_1.generateRefreshToken)(payload);
            // Save refresh in cookie
            const refreshTokenLocationName = config_1.default?.AUTH_REFRESH_TOKEN_NAME;
            const maxAge = config_1.default?.REFRESH_TOKEN_MAXAGE;
            res.cookie(refreshTokenLocationName, refreshToken, {
                httpOnly: true,
                maxAge,
                sameSite: "none",
            });
            const response = {
                user: {
                    loginId,
                    email: account.email,
                    firstaname: user?.firstname,
                    lastname: user?.lastname,
                    role: account.role,
                },
                token: accessToken,
            };
            return Response_1.default.sendSuccess(res, sucessfulLogin, http_status_codes_1.StatusCodes.CREATED, response);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    /**
     * Login of user
     *
     * @param req Express Request Object
     * @param res Express Response Object
     */
    static Reset(req, res, next) {
        try {
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map