/* eslint-disable no-param-reassign */
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  type NestFastifyApplication as App,
} from '@nestjs/platform-fastify';
import { Config } from 'src/config';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import compressor from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';

const boot = async () => {
  const adapter = new FastifyAdapter({
    disableRequestLogging: true,
    bodyLimit: 5242880 /* 5MB */,
    ignoreTrailingSlash: true,
  });
  const fastify = adapter.getInstance();

  const app = await NestFactory.create<App>(AppModule, adapter);
  const config = app.get(Config);
  const { isDev } = config;
  const logger = new Logger('Bootstrap');
  const { host, port } = config;

  /** firebase의 폐쇄성 때문 */
  app.setGlobalPrefix('api');

  adapter.getInstance().addHook('onRequest', (request: any, reply: any, done: any) => {
    reply.setHeader = function(key: any, value: any) {
      return this.raw.setHeader(key, value);
    };
    reply.end = function() {
      this.raw.end();
    };
    request.res = reply;
    done();
  });
  const { isProd } = config;

  logger.log('Fastify Initializing');
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
    timeWindow: 2000,
    allowList: isProd ? [] : ['127.0.0.1'],
    continueExceeding: true,
    skipOnError: true,
    cache: 10000,
  });

  const listen = async () => {
    await app.listen(port, host);
    if (isDev) {
      logger.log(`⚡ http://${host}:${port}`);
    }
    return app;
  };
  return { listen };
};

boot()
  .then((server) => server.listen());
