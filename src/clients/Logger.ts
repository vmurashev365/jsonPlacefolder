import winston from 'winston';
import path from 'path';
import fs from 'fs';

export class Logger {
  private logger: winston.Logger;
  private moduleName: string;

  constructor(moduleName: string = 'App') {
    this.moduleName = moduleName;
    
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logLevel = process.env.LOG_LEVEL || 'info';
    const logToFile = process.env.LOG_TO_FILE === 'true';
    const logFilePath = process.env.LOG_FILE_PATH || 'logs/test.log';

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'HH:mm:ss' }),
          winston.format.printf(({ timestamp, level, message, moduleName, ...meta }) => {
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
            return `${timestamp} [${moduleName || this.moduleName}] ${level}: ${message}${metaStr}`;
          })
        )
      })
    ];

    if (logToFile) {
      transports.push(
        new winston.transports.File({
          filename: logFilePath,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        })
      );
    }

    this.logger = winston.createLogger({
      level: logLevel,
      transports,
      exitOnError: false
    });
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, { moduleName: this.moduleName, ...meta });
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, { moduleName: this.moduleName, ...meta });
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, { moduleName: this.moduleName, ...meta });
  }

  error(message: string, error?: any): void {
    const errorMeta = error instanceof Error 
      ? { error: error.message, stack: error.stack }
      : { error };
    this.logger.error(message, { moduleName: this.moduleName, ...errorMeta });
  }

  http(message: string, meta?: any): void {
    this.logger.http(message, { moduleName: this.moduleName, ...meta });
  }

  verbose(message: string, meta?: any): void {
    this.logger.verbose(message, { moduleName: this.moduleName, ...meta });
  }

  silly(message: string, meta?: any): void {
    this.logger.silly(message, { moduleName: this.moduleName, ...meta });
  }

  // Special method for assertions with visual formatting
  assertion(description: string, passed: boolean, expected: any, actual: any): void {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const message = `${status}: ${description}`;
    
    if (passed) {
      this.info(message, { expected, actual });
    } else {
      this.error(message, { expected, actual });
    }
  }

  // Method for step logging with emojis
  step(stepText: string, status: 'start' | 'pass' | 'fail' | 'skip' = 'start'): void {
    const statusEmojis = {
      start: '🔄',
      pass: '✅',
      fail: '❌',
      skip: '⏭️'
    };
    
    const emoji = statusEmojis[status];
    const message = `${emoji} ${stepText}`;
    
    switch (status) {
      case 'fail':
        this.error(message);
        break;
      case 'skip':
        this.warn(message);
        break;
      default:
        this.info(message);
    }
  }

  // Method for timing operations
  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }

  // Method for creating child logger with additional context
  child(additionalContext: Record<string, any>): Logger {
    const childLogger = new Logger(this.moduleName);
    childLogger.logger = this.logger.child(additionalContext);
    return childLogger;
  }
}
