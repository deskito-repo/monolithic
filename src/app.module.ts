import { Module } from '@nestjs/common';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { AppController } from './app.controller';
import { Config } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import { SuggestModule } from './modules/suggestion/suggestion.module';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: Config,
      load: dotenvLoader({
        keyTransformer: (key: string) => key.toLowerCase(),
      }),
    }),
    AuthModule,
    UserModule,
    SessionModule,
    SuggestModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
