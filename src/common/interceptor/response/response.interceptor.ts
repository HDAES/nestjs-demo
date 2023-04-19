import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Inject,
  NestInterceptor,
} from '@nestjs/common';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Request, Response } from 'express';
import { getReqMainInfo } from 'src/common/middleware/logger/utils';

interface data<T> {
  data: T;
}
@Injectable()
export class ResponseInterceptor<T = any> implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<data<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    return next.handle().pipe(
      map((data) => {
        this.logger.info('response', {
          responseData: data,
          req: getReqMainInfo(request),
        });
        return {
          data,
          code: 200,
          message: '成功',
          success: true,
        };
      }),
    );
  }
}
