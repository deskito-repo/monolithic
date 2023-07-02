import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import compressor from '@fastify/compress';
import { ConfigService } from 'nestjs-config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FastifyInstance } from 'fastify';
export default async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      disableRequestLogging: true,
    }),
  );
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);
  const isProd = configService.get('app.isProd');
  await app.register(helmet);
  await app.register(rateLimit, {
    max: 15,
    timeWindow: 1000,
    allowList: isProd ? [] : ['127.0.0.1'],
    continueExceeding: true,
    skipOnError: true,
    cache: 10000,
  });
  await app.register(compressor, {
    global: true,
  });
  app.register(cors, {
    origin: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: isProd,
    }),
  );
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useLogger(app.get(Logger));

  const fastify: FastifyInstance = app.getHttpAdapter().getInstance();
  fastify.decorateReply('setHeader', function (name: string, value: unknown) {
    this.header(name, value);
  });

  const host = '0.0.0.0';
  const port = isProd ? 80 : 3000;
  await app.listen(port, host);
  isProd || logger.log(`⚡ http://${host}:${port}`);
  return app;
}
