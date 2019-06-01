import * as path from 'path';
import * as fs from 'fs';
import * as winston from 'winston';
import * as rotate from 'winston-daily-rotate-file';

class Logger {
  dir = null;
  logger = null;
  constructor(dir) {
    this.dir = path.join(__dirname, dir);
    this.init();
  }

  init() {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        })
      ),
      transports: [
        new (winston.transports.DailyRotateFile)({
          filename: 'dispatch.log',
          dirname: this.dir,
          maxsize: 20971520, // 20MB
          maxFiles: 25,
          datePattern: 'YYYY_MM_DD',
        }),
        new (winston.transports.Console)({
          colorize: true,
        }),
      ],
    });
  }

  error(message) {
    this.logger.error(
      message.stack ? message.stack : typeof message === 'object' ? JSON.stringify(message) : message.toString()
    );
  }

  info(message) {
    this.logger.info(message);
  }
}

export default Logger;
