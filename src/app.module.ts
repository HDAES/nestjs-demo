import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { AuthGuard } from './common/guards/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './common/guards/auth/constants';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from './config/env';

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
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY', 'HADES'),
        signOptions: {
          expiresIn: configService.get<string | number>(
            'JWT_EXPIRESIN_TIME',
            '30d',
          ),
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('THROTTLER_TTL', 60),
        limit: configService.get<number>('THROTTLER_LIMIT', 10),
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
  ],
})
export class AppModule {}
