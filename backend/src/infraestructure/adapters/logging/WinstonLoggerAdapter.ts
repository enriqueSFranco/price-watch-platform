import { createLogger, Logger, transports } from "winston";
import { baseWinstonConfig, ILoggerAdapter, LogLevel } from "./config";

export class WinstonLoggerAdapter implements ILoggerAdapter {
  private readonly logger: Logger;

  constructor(private readonly fileName: string) {
    this.logger = createLogger({...baseWinstonConfig, transports: [
      new transports.Console(),
      new transports.File({
        filename: `logs/${this.fileName}.log`,
        level: 'info'
      }),
      new transports.File({
        filename: `logs/${this.fileName}-error.log`,
        level: 'error'
      })
    ]});
  }

  public debug(level: LogLevel, message: string) {
    this.logger.log(level, message);
  }

  public info(message: string) {
    this.logger.info("info", message);
  }
  public warn(message: string) {
    this.logger.warn("warn", message);
  }
  public error(message: string) {
    this.logger.error("error", message)
  }
}
