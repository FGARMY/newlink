import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Newlink API server is running on http://localhost:${port}/api/v1`);
}

bootstrap();
