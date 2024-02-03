import { Module } from '@nestjs/common';
import type { NestModule, MiddlewareConsumer } from '@nestjs/common/interfaces';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { Config } from './config';
import { SessionModule } from './modules/session/session.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { SessionInterceptor } from './interceptors/session/session.interceptor';
import { RolesGuard } from './guards/role.guard';
import { SuggestModule } from './modules/suggestion/suggestion.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: Config,
      load: dotenvLoader({
        keyTransformer: (key: string) => key.toLowerCase(),
      }),
    }),
    SessionModule,
    AuthModule,
    UserModule,
    SuggestModule,
    WeatherModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SessionInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
