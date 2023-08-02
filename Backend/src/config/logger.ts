import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  // level: "debug",
  format: combine(label({ label: "Kanban Task Management" }), timestamp(), myFormat),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({
      filename: "logger/info.log",
      level: "info",
    }),
    new transports.File({
      filename: "logger/error.log",
      level: "warn",
    }),
  ],
});

export default logger;
