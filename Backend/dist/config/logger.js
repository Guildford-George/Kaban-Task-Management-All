"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, label, printf } = winston_1.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    // level: "debug",
    format: combine(label({ label: "Kanban Task Management" }), timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console({ level: "debug" }),
        new winston_1.transports.File({
            filename: "logger/info.log",
            level: "info",
        }),
        new winston_1.transports.File({
            filename: "logger/error.log",
            level: "warn",
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map