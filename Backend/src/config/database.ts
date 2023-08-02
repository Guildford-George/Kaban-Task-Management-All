import { PrismaClient } from "@prisma/client";
import { QueryEvent } from "../..";
import logger from "./logger";

const prisma = new PrismaClient({
  // log: [
  //   {
  //     emit: "event",
  //     level: "query",
  //   },
  //   {
  //     emit: "stdout",
  //     level: "error",
  //   },
  //   {
  //     emit: "stdout",
  //     level: "info",
  //   },
  //   {
  //     emit: "stdout",
  //     level: "warn",
  //   },
  // ],
});

// prisma.$on("query", (e:QueryEvent) => {
//   const databaseQuery={
//     query: e.query,
//     params: e.params,
//     target: e.target
//   }
//   logger.info("DATABASE QUERY"+" "+JSON.stringify(databaseQuery))
// });

export default prisma;
