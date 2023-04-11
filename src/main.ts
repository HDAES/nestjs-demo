import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptor/response/response.interceptor';
import { HttpFilterFilter } from './filter/http-filter/http-filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpFilterFilter());
  await app.listen(4000);
}
bootstrap();
