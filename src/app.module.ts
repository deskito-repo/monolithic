import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
  ],
  controllers: [AppController],
})
export class AppModule {}
