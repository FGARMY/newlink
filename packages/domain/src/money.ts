import { DomainError } from './errors.js';

/**
 * All money is integer paise (1 INR = 100 paise). Never use floating-point rupees in
 * business logic; convert only at the presentation edge.
 */
export type Paise = number;

export const BPS_DENOMINATOR = 10_000;

export function assertPaise(value: number, label = 'amount'): Paise {
  if (!Number.isSafeInteger(value)) {
    throw new DomainError('INVALID_INPUT', `${label} must be an integer number of paise`);
  }
  return value;
}

export function rupeesToPaise(rupees: number): Paise {
  return Math.round(rupees * 100);
}

/**
 * Multiply an amount by a basis-point rate with half-up rounding.
 * 1800 bps = 18%. Works for non-negative and negative amounts symmetrically.
 */
export function applyBps(amount: Paise, bps: number): Paise {
  assertPaise(amount);
  if (!Number.isFinite(bps)) throw new DomainError('INVALID_INPUT', 'bps must be finite');
  const sign = amount < 0 ? -1 : 1;
  const raw = Math.abs(amount) * bps;
  return sign * Math.floor((raw + BPS_DENOMINATOR / 2) / BPS_DENOMINATOR);
}

/** Scale `amount` by `numerator / denominator`, rounding half-up. */
export function scale(amount: Paise, numerator: number, denominator: number): Paise {
  if (denominator === 0) throw new DomainError('INVALID_INPUT', 'denominator must not be zero');
  return Math.floor((amount * numerator) / denominator + 0.5);
}

export function sumPaise(values: readonly Paise[]): Paise {
  return values.reduce((acc, v) => acc + v, 0);
}
