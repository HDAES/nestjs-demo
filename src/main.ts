import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import Swagger from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  new Swagger(app);

  app.useStaticAssets(join(__dirname, 'images'));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}
bootstrap();
