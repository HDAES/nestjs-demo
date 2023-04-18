import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';
import { HttpFilterFilter } from './common/filter/http-filter/http-filter.filter';
import Swagger from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpFilterFilter());
  new Swagger(app);

  app.useStaticAssets(join(__dirname, 'images'));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}
bootstrap();
