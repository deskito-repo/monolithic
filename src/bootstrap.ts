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
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { FastifyInstance, fastify as Fastify } from 'fastify';

const createNestServer = async (fastify: FastifyInstance) => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastify),
  );
  const configService = app.get(ConfigService);
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
  const logger = new Logger('bootstrap');
  const host = '0.0.0.0';
  const port = isProd ? 80 : 3000;
  await app.listen(port, host);
  isProd || logger.log(`⚡ http://${host}:${port}`);
  return app;
}

export default () => {
  const fastify = Fastify({
    disableRequestLogging: true,
  });
  createNestServer(fastify);
};