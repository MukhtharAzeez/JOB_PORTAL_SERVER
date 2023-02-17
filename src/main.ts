/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://main--mellifluous-maamoul-f0c941.netlify.app'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
    // exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    // allowedHeaders: ['Content-Type', 'Access'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
    }),
  );
  await app.listen(4000);
}
bootstrap();
