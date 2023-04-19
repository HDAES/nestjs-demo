import {
  ArgumentsHost,
  Catch,
  Inject,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request, Response } from 'express';
import { getReqMainInfo } from 'src/common/middleware/logger/utils';
@Catch()
export class HttpFilterFilter<T> implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.error(
      status === HttpStatus.BAD_REQUEST
        ? exception.getResponse()['message']
        : exception.message,
      {
        status,
        req: getReqMainInfo(request),
      },
    );

    response.status(status).json({
      message:
        status === HttpStatus.BAD_REQUEST
          ? exception.getResponse()['message']
          : exception.message,
      time: new Date().getTime(),
      success: false,
      path: request.url,
      status,
    });
  }
}
