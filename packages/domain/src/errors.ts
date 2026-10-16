/**
 * Stable machine-readable error codes raised by domain rules.
 * The API maps these to HTTP status codes; clients switch on `code`, never on `message`.
 */
export const DOMAIN_ERROR_CODES = [
  'INVALID_INPUT',
  'INVALID_STATE_TRANSITION',
  'INVALID_BOOKING_WINDOW',
  'VEHICLE_UNAVAILABLE',
  'PRICING_UNAVAILABLE',
  'COUPON_INVALID',
  'SECURITY_CHECK_FAILED',
  'PAYMENT_FAILED',
] as const;

export type DomainErrorCode = (typeof DOMAIN_ERROR_CODES)[number];

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly details: unknown;

  constructor(code: DomainErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.details = details;
  }
}

export function isDomainError(value: unknown): value is DomainError {
  return value instanceof DomainError;
}
