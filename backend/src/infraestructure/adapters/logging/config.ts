import { format, LoggerOptions, transports } from "winston";

export interface ILoggerAdapter {
  debug: (level: LogLevel, message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export const baseWinstonConfig: Omit<LoggerOptions, "transports"> = {
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.colorize({ all: true }),
    format.printf(({ level, message, timestamp, ...meta }) => {
      const metaStr = Object.keys(meta).length ? `${JSON.stringify(meta)}` : "";
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}`;
    })
  ),
};
