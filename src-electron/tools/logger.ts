import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: format.combine(
    format.ms(),
    format.colorize(),
    format.printf((info) => {
      return `${info.level}(${info.service}) ${info.message} ${info.ms}`
    })
  ),
  transports: [new transports.Console()],
});
