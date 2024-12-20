import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger('ApplicationLogger');

  log(message: string, context?: string) {
    const formattedMessage = context ? `[${context}] ${message}` : message;
    this.logger.log(formattedMessage);
  }

  error(message: string, trace?: string, context?: string) {
    const formattedMessage = context ? `[${context}] ${message}` : message;
    this.logger.error(formattedMessage, trace);
  }

  warn(message: string, context?: string) {
    const formattedMessage = context ? `[${context}] ${message}` : message;
    this.logger.warn(formattedMessage);
  }

  debug(message: string, context?: string) {
    const formattedMessage = context ? `[${context}] ${message}` : message;
    this.logger.debug(formattedMessage);
  }

  verbose(message: string, context?: string) {
    const formattedMessage = context ? `[${context}] ${message}` : message;
    this.logger.verbose(formattedMessage);
  }
}
