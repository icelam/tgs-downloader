import path from 'path';
import { createLogger, format, transports } from 'winston';
import showMessage from './message.js';

const LOG_FOLDER = path.resolve(process.cwd(), './logs');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'hkpl-hyread-downloader' },
  transports: [
    new transports.File({ filename: `${LOG_FOLDER}/error.log`, level: 'error' }),
    new transports.File({ filename: `${LOG_FOLDER}/combined.log` }),
  ],
});

const errorLogger = (error) => {
  showMessage(error.message, { color: 'red', emoji: '⛔' });
  logger.error(error);
};

export default errorLogger;
