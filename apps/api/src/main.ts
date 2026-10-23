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

  // Security Middleware: HTTP Security Headers
  const httpAdapter = app.getHttpAdapter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  httpAdapter.use((req: any, res: any, next: () => void) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // Strict CORS Security Configuration
  const configuredOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
    : [];

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://speioncars.vercel.app',
    ...configuredOrigins,
  ];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, server-to-server, curl)
      if (!origin) return callback(null, true);

      // Check allowed list or Vercel preview domains
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost');

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS security policy'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Speion Cars API server running on http://localhost:${port}/api/v1 (CORS & Security active)`);
}

bootstrap();
