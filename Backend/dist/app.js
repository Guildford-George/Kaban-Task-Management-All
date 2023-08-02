"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config/config"));
const morgan_1 = __importDefault(require("morgan"));
const ErrorHandler_1 = __importDefault(require("./middlewares/ErrorHandler"));
const serverHealth_1 = __importDefault(require("./utils/serverHealth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Auth_1 = __importDefault(require("./routers/Auth"));
const Api_1 = __importDefault(require("./routers/Api"));
const app = (0, express_1.default)();
// default app setup
app.use((0, cors_1.default)({
    origin: config_1.default?.ALLOWEDORIGIN,
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routers
app.use("/auth", Auth_1.default);
app.use("/api/v1", Api_1.default);
// Server Live
app.get("/", serverHealth_1.default);
// Handle Error
app.use(ErrorHandler_1.default.HandleError);
exports.default = app;
//# sourceMappingURL=app.js.map