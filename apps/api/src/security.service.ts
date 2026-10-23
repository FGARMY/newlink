import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

export interface JwtTokenPayload {
  sub: string;
  email?: string | null;
  name?: string | null;
  role?: string;
  iat?: number;
  exp?: number;
}

interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil: number;
}

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private readonly jwtSecret: string;
  private readonly rateLimits = new Map<string, RateLimitRecord>();

  constructor() {
    this.jwtSecret =
      process.env.JWT_SECRET ||
      'speion-cars-secure-jwt-key-production-change-me-2026';
    
    // Cleanup rate limiter every 10 minutes
    setInterval(() => this.cleanupRateLimits(), 10 * 60 * 1000).unref();
  }

  /* ------------------------------------------------------------------------------------------ */
  /* Cryptographic HMAC-SHA256 JWT Implementation                                              */
  /* ------------------------------------------------------------------------------------------ */

  signJwt(payload: Record<string, unknown>, expiresInSeconds = 7 * 86400): string {
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
    const signature = createHmac('sha256', this.jwtSecret)
      .update(`${header}.${body}`)
      .digest('base64url');

    return `${header}.${body}.${signature}`;
  }

  verifyJwt<T = JwtTokenPayload>(token: string): { valid: boolean; payload?: T; error?: string } {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Token missing' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token structure' };
    }

    const [header, body, signature] = parts;
    if (!header || !body || !signature) {
      return { valid: false, error: 'Invalid token structure' };
    }

    try {
      const expectedSignature = createHmac('sha256', this.jwtSecret)
        .update(`${header}.${body}`)
        .digest('base64url');

      const sigBuf = Buffer.from(signature);
      const expectedBuf = Buffer.from(expectedSignature);

      if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
        return { valid: false, error: 'Invalid token signature' };
      }

      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as JwtTokenPayload;
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        return { valid: false, error: 'Token expired' };
      }

      return { valid: true, payload: payload as unknown as T };
    } catch {
      return { valid: false, error: 'Malformed token payload' };
    }
  }

  /* ------------------------------------------------------------------------------------------ */
  /* In-Memory Anti-Brute-Force & Rate Limiter                                                 */
  /* ------------------------------------------------------------------------------------------ */

  checkRateLimit(
    key: string,
    maxAttempts = 5,
    windowSeconds = 300,
    lockoutSeconds = 900,
  ): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
    const now = Date.now();
    const record = this.rateLimits.get(key);

    if (!record) {
      return { allowed: true, remaining: maxAttempts, retryAfterSeconds: 0 };
    }

    // Check if currently locked out
    if (record.lockedUntil > now) {
      const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    // Reset if window has elapsed
    if (now - record.firstAttemptAt > windowSeconds * 1000) {
      this.rateLimits.delete(key);
      return { allowed: true, remaining: maxAttempts, retryAfterSeconds: 0 };
    }

    if (record.attempts >= maxAttempts) {
      record.lockedUntil = now + lockoutSeconds * 1000;
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: lockoutSeconds,
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxAttempts - record.attempts),
      retryAfterSeconds: 0,
    };
  }

  recordFailure(key: string, windowSeconds = 300): void {
    const now = Date.now();
    const record = this.rateLimits.get(key);

    if (!record || now - record.firstAttemptAt > windowSeconds * 1000) {
      this.rateLimits.set(key, {
        attempts: 1,
        firstAttemptAt: now,
        lockedUntil: 0,
      });
    } else {
      record.attempts += 1;
    }
  }

  resetRateLimit(key: string): void {
    this.rateLimits.delete(key);
  }

  private cleanupRateLimits(): void {
    const now = Date.now();
    for (const [key, record] of this.rateLimits.entries()) {
      if (record.lockedUntil > 0 && record.lockedUntil < now) {
        this.rateLimits.delete(key);
      } else if (now - record.firstAttemptAt > 60 * 60 * 1000) {
        this.rateLimits.delete(key);
      }
    }
  }
}
