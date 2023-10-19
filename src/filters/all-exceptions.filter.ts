import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);
    super.catch(exception, host);
  }
}
