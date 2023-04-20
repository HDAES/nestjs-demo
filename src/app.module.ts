import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { AuthGuard } from './common/guards/auth/auth.guard';
import envConfig from './config/env';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { HttpFilterFilter } from './common/filter/http-filter/http-filter.filter';
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASSWORD', '123456'),
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        database: configService.get('DB_DATABASE', 'db_nest'),
        synchronize: true, //是否自动将实体类同步到数据库
        retryDelay: 500,
        retryAttempts: 10, //重试连接数据库的次数
        autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
        dateStrings: true,
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY', 'HADES'),
        signOptions: {
          expiresIn: configService.get<string | number>(
            'JWT_EXPIRES_IN_TIME',
            '30d',
          ),
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('THROTTLER_TTL', 60),
        limit: configService.get<number>('THROTTLER_LIMIT', 10),
      }),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transports: [
          new winston.transports.DailyRotateFile({
            dirname: configService.get('LOG_DIRNAME', 'logs'),
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: configService.get('LOG_MAX_SIZE', '20m'),
            maxFiles: configService.get('LOG_MAX_FILES', '14d'),
            format: winston.format.combine(
              winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
              }),
              winston.format.json(),
            ),
          }),
        ],
      }),
    }),
    UserModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpFilterFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
