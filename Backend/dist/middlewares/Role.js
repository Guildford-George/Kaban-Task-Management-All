"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAuthorization = void 0;
const message_1 = require("../constant/message");
const Error_1 = require("../interface/Error");
const database_1 = __importDefault(require("../config/database"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const { unauthorized } = message_1.ERRORMESSAGE;
const { unauthorizedUser } = message_1.LOGGERMESSAGE;
class RoleAuthorization {
    static Verify(AccoutRole) {
        return async (req, res, next) => {
            try {
                const { loginId, role, tokenType } = req.payload;
                if (!loginId || !role || !tokenType) {
                    (0, CustomError_1.default)(Error_1.ErrorType.UNAUTHORIZED, unauthorized, unauthorizedUser);
                }
                //   Check for valid loginId
                const account = await database_1.default.account.findFirst({
                    where: {
                        loginId,
                        role: AccoutRole,
                    },
                });
                if (account !== null) {
                    (0, CustomError_1.default)(Error_1.ErrorType.UNAUTHORIZED, unauthorized, unauthorizedUser);
                }
                next();
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.RoleAuthorization = RoleAuthorization;
//# sourceMappingURL=Role.js.map