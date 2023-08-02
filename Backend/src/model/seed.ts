import { Role } from "@prisma/client";
import prisma from "../config/database";
import { encryptPassword } from "../utils/GeneralUtils";

(
    async () => {
        const users = [
          {
            account: {
              email: "user1@test.org",
              password: await encryptPassword("User1password++"),
              role: Role.USER,
            },
            user: {
              firstname: "Elon",
              lastname: "Musk",
            },
          },
          {
            account: {
              email: "user2@test.org",
              password: await encryptPassword("User2password++"),
              role: Role.USER,
            },
            user: {
              firstname: "Jeff",
              lastname: "Bezos",
            },
          },
          {
            account: {
              email: "user3@test.org",
              password: await encryptPassword("User3password++"),
              role: Role.USER,
            },
            user: {
              firstname: "Bill",
              lastname: "Gate",
            },
          },
        ];
        await Promise.all(
          users.map(async (act) => {
            await prisma.account.create({
              data: {
                ...act.account,
                user: {
                  create: {
                    ...act.user,
                  },
                },
              },
            });
          })
        );
      }
)();
