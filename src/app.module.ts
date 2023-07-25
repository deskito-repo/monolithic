import { Module } from '@nestjs/common';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { AppController } from './app.controller';
import { Config } from './config';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: Config,
      load: dotenvLoader({
        keyTransformer: (key: string) => key.toLowerCase(),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule { }
