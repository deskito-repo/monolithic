import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import compressor from '@fastify/compress';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Config } from './config';

const createNestServer = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      disableRequestLogging: true,
    }),
  );
  const fastify = app.getHttpAdapter().getInstance();
  const config = app.get(Config);
  const { isDev, isProd } = config;
  await fastify.register(helmet);
  await fastify.register(compressor, {
    global: true,
  });
  fastify.register(cors, {
    origin: true,
  });
  await fastify.register(rateLimit, {
    max: 15,
    timeWindow: 1000,
    allowList: isProd ? [] : ['127.0.0.1'],
    continueExceeding: true,
    skipOnError: true,
    cache: 10000,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: isProd,
    }),
  );
  const logger = new Logger('Bootstrap');
  const { host, port } = config;
  const boot = async () => {
    await app.listen(port, host);
    if (isDev) {
      logger.log(`⚡ http://${host}:${port}`);
    }
    return app;
  };
  return {
    boot,
  };
};

export default () => ({ createNestServer });
