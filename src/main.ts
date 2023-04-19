import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { join } from 'path';
import { AppModule } from './app.module';
import Swagger from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  new Swagger(app);

  app.useStaticAssets(join(__dirname, 'images'));
  app.use(
    session({
      secret: 'hades',
      name: 'hades.session',
      rolling: true,
      cookie: { maxAge: null },
    }),
  );
  await app.listen(4000);
}
bootstrap();
