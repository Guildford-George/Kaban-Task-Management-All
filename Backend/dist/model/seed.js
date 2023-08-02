"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const GeneralUtils_1 = require("../utils/GeneralUtils");
(async () => {
    const users = [
        {
            account: {
                email: "user1@test.org",
                password: await (0, GeneralUtils_1.encryptPassword)("User1password++"),
                role: client_1.Role.USER,
            },
            user: {
                firstname: "Elon",
                lastname: "Musk",
            },
        },
        {
            account: {
                email: "user2@test.org",
                password: await (0, GeneralUtils_1.encryptPassword)("User2password++"),
                role: client_1.Role.USER,
            },
            user: {
                firstname: "Jeff",
                lastname: "Bezos",
            },
        },
        {
            account: {
                email: "user3@test.org",
                password: await (0, GeneralUtils_1.encryptPassword)("User3password++"),
                role: client_1.Role.USER,
            },
            user: {
                firstname: "Bill",
                lastname: "Gate",
            },
        },
    ];
    await Promise.all(users.map(async (act) => {
        await database_1.default.account.create({
            data: {
                ...act.account,
                user: {
                    create: {
                        ...act.user,
                    },
                },
            },
        });
    }));
})();
//# sourceMappingURL=seed.js.map