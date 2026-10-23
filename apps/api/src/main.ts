import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Automatically load environment files if present
const candidatePaths = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '.env.local'),
  resolve(process.cwd(), '../../.env'),
  resolve(process.cwd(), '../../.env.local'),
];
for (const p of candidatePaths) {
  if (existsSync(p)) {
    try {
      process.loadEnvFile(p);
    } catch {
      // Ignore individual file parsing errors if already populated
    }
  }
}

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
