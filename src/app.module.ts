import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ValibotModule } from 'nestjs-valibot';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { AppController } from './app.controller';
import { Config } from './config';
import { SessionModule } from './modules/session/session.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { SuggestModule } from './modules/suggestion/suggestion.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: Config,
      load: dotenvLoader(),
    }),
    ValibotModule.forRoot({
      disableErrorMessages: true,
    }),
    SessionModule,
    UserModule,
    AuthModule,
    SuggestModule,
    WeatherModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
