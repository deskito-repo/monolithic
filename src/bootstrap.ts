import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import compressor from '@fastify/compress';
import { Logger, ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { Config } from './config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

const createNestServer = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      disableRequestLogging: true,
      bodyLimit: 5242880 /* 5MB */,
    }),
  );
  const { httpAdapter } = app.get(HttpAdapterHost);
  const fastify = httpAdapter.getInstance();
  const config = app.get(Config);
  const { isDev, isProd } = config;
  await fastify.register(helmet);
  await fastify.register(compressor, {
    global: true,
  });
  await fastify.register(cors, {
    origin: true,
  });
  await fastify.register(fastifyCookie);
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
      enableDebugMessages: isDev,
    }),
  );

  if (isDev) {
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  }
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
