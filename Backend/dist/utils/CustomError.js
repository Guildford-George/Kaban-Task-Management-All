"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_generator_1 = __importDefault(require("custom-error-generator"));
const CustomError = (message, errorData) => {
    const error = (0, custom_error_generator_1.default)(message, errorData);
    const newError = new error(message);
    return newError;
};
const ThrowError = (type, message, logMessage, errors = null) => {
    const customeErrorObj = {
        message,
        type,
        logMessage,
        errors,
    };
    const error = CustomError(message, customeErrorObj);
    throw error;
};
exports.default = ThrowError;
//# sourceMappingURL=CustomError.js.map