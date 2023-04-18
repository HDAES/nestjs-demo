import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';
@Catch()
export class HttpFilterFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

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
