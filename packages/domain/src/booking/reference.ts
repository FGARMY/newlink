/**
 * Human-friendly booking references, e.g. `NL-PN-7K3Q9M`.
 * Crockford base32 (no I, L, O, U) avoids misreads over the phone. 32^6 ≈ 1.07 billion
 * combinations; uniqueness is still enforced by a DB unique index with retry on collision.
 * A reference is an identifier, never an authorization secret.
 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export type RandomBytes = (length: number) => Uint8Array;

const defaultRandom: RandomBytes = (length) => crypto.getRandomValues(new Uint8Array(length));

export function generateBookingReference(
  brandPrefix: string,
  cityCode: string,
  random: RandomBytes = defaultRandom,
  length = 6,
): string {
  const bytes = random(length);
  let body = '';
  for (let i = 0; i < length; i++) {
    // 256 is divisible by 32, so `% 32` has no modulo bias.
    body += ALPHABET[(bytes[i] ?? 0) % ALPHABET.length];
  }
  return `${brandPrefix.toUpperCase()}-${cityCode.toUpperCase()}-${body}`;
}

const REFERENCE_RE = /^[A-Z]{2,4}-[A-Z]{2,3}-[0-9A-HJKMNP-TV-Z]{6}$/;

export function isBookingReference(value: string): boolean {
  return REFERENCE_RE.test(value);
}
