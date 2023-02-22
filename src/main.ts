/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://main.d1irnkz1l4wgu5.amplifyapp.com'],
    // origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
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
