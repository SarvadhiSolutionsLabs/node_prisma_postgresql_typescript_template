import { createLogger, format, transports } from 'winston';
import { environment } from '@config/config';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} [${level}]: ${message}`;
});

export const logger = createLogger({
  level: environment.logLevel,
  format: combine(colorize(), timestamp(), logFormat),
  transports: [new transports.Console()]
});

