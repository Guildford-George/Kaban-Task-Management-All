"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./logger"));
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "stdout",
            level: "error",
        },
        {
            emit: "stdout",
            level: "info",
        },
        {
            emit: "stdout",
            level: "warn",
        },
    ],
});
prisma.$on("query", (e) => {
    const databaseQuery = {
        query: e.query,
        params: e.params,
        target: e.target
    };
    logger_1.default.info("DATABASE QUERY" + " " + JSON.stringify(databaseQuery));
});
exports.default = prisma;
//# sourceMappingURL=database.js.map