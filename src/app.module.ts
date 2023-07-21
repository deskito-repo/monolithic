import { Module } from '@nestjs/common';
import { TypedConfigModule, fileLoader } from 'nest-typed-config';
import { AppController } from './app.controller';
import { Config } from './config';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: Config,
      load: fileLoader({
        ignoreEnvironmentVariableSubstitution: false,
        disallowUndefinedEnvironmentVariables: false,
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule { }
