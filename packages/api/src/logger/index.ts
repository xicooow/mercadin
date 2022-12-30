import * as fecha from "fecha";
import { createLogger, transports, format } from "winston";

import { MorganConfig } from "../types";

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: fecha.format(new Date(), "DD/MM/YYYY HH:mm:ss Z"),
    }),
    format.printf(
      log => `${log.timestamp} [${log.level}] ${log.message}`
    )
  ),
  transports: [new transports.Console({ level: "http" })],
});

export const MORGAN_CONFIG: MorganConfig = {
  format:
    ":method :url :status :res[content-length] - :response-time ms :user-agent",
  options: {
    stream: {
      write: message => {
        logger.http(message.trim());
      },
    },
  },
};

export default logger;
