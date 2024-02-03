import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import compressor from '@fastify/compress';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import { FastifyInstance } from 'fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { fastifySession } from '@fastify/session';
import { AppModule } from './app.module';
import { Config } from './config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { version } from '../package.json';

const boot = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      disableRequestLogging: true,
      bodyLimit: 5242880 /* 5MB */,
      ignoreTrailingSlash: true,
    }),
  );
  /** firebase의 폐쇄성 때문 */
  app.setGlobalPrefix('api');
  const { httpAdapter } = app.get(HttpAdapterHost);
  const fastify = httpAdapter.getInstance<FastifyInstance>();
  fastify.addHook('onRequest', (request: any, reply: any, done) => {
    // eslint-disable-next-line no-param-reassign
    reply.setHeader = function(key: any, value: any) {
      return this.raw.setHeader(key, value);
    };
    // eslint-disable-next-line no-param-reassign
    reply.end = function() {
      this.raw.end();
    };
    request.res = reply;
    done();
  });
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
    timeWindow: 2000,
    allowList: isProd ? [] : ['127.0.0.1'],
    continueExceeding: true,
    skipOnError: true,
    cache: 10000,
  });
  fastify.register(fastifySession, { secret: 'ga78dT&!Y@*(fjhaudasdhwajidqwh17 y217e78T&*A' });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: isProd,
      enableDebugMessages: isDev,
    }),
  );

  const apiConfig = new DocumentBuilder()
    .setTitle('API documentation')
    .setVersion(version)
    .addTag(config.appName)
    .build();
  const document = SwaggerModule.createDocument(app, apiConfig);
  writeFileSync('./swagger.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Ver',
  });
  if (isDev) {
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  }
  const logger = new Logger('Bootstrap');
  const { host, port } = config;
  const listen = async () => {
    await app.listen(port, host);
    if (isDev) {
      logger.log(`⚡ http://${host}:${port}`);
    }
    return app;
  };
  return {
    listen,
  };
};
boot()
  .then((server) => server.listen());
