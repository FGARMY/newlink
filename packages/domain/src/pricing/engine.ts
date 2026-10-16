import { DomainError } from '../errors.js';
import { type Paise, applyBps, assertPaise, sumPaise } from '../money.js';
import type { Interval } from '../time/interval.js';
import { durationMinutes, makeInterval } from '../time/interval.js';
import { getLocalParts, toLocalIsoDate } from '../time/zoned.js';

/* ------------------------------------------------------------------------------------------ */
/* Pricing Types                                                                              */
/* ------------------------------------------------------------------------------------------ */

export interface RatePlan {
  readonly id: string;
  readonly scope: 'VEHICLE' | 'MODEL' | 'CATEGORY';
  readonly scopeId: string;
  readonly cityId: string;
  /** Hourly rate in paise. */
  readonly hourlyRate: Paise;
  /** Weekday 24-hour rate in paise. */
  readonly weekdayDailyRate: Paise;
  /** Weekend 24-hour rate in paise. */
  readonly weekendDailyRate: Paise;
  /** Refundable security deposit in paise. */
  readonly securityDeposit: Paise;
  readonly minHours: number;
}

export interface PriceAdjustment {
  readonly id: string;
  readonly name: string;
  readonly kind: 'SEASON' | 'HOLIDAY' | 'PROMO';
  readonly startDate: string; // YYYY-MM-DD
  readonly endDate: string;   // YYYY-MM-DD
  readonly mode: 'MULTIPLIER' | 'OVERRIDE_DAILY';
  /** If MULTIPLIER, basis points (e.g. 11500 = 1.15x / +15%). If OVERRIDE_DAILY, paise amount. */
  readonly value: number;
  readonly priority: number;
}

export interface TaxRule {
  readonly id: string;
  readonly name: string;
  /** Basis points (e.g. 1800 = 18% GST). */
  readonly rateBps: number;
}

export interface AppliedCoupon {
  readonly id: string;
  readonly code: string;
  readonly discountAmount: Paise;
}

export interface PricingLineItem {
  readonly kind: 'RENTAL' | 'DISCOUNT' | 'TAX' | 'FEE' | 'DEPOSIT';
  readonly label: string;
  readonly amount: Paise;
  readonly metadata?: Record<string, unknown>;
}

export interface PricingQuote {
  readonly rentalDurationMinutes: number;
  readonly billableHours: number;
  readonly baseRental: Paise;
  readonly discount: Paise;
  readonly taxableValue: Paise;
  readonly tax: Paise;
  readonly rentalTotal: Paise;
  readonly securityDeposit: Paise;
  readonly payableNow: Paise;
  readonly lineItems: readonly PricingLineItem[];
  readonly coupon: AppliedCoupon | null;
  readonly ratePlanId: string;
}

export interface PricingRequest {
  readonly interval: Interval;
  readonly timeZone: string;
  readonly ratePlan: RatePlan;
  readonly adjustments?: readonly PriceAdjustment[];
  readonly taxRule: TaxRule;
  readonly couponDiscount?: AppliedCoupon;
}

/* ------------------------------------------------------------------------------------------ */
/* Pricing Engine Calculation                                                                 */
/* ------------------------------------------------------------------------------------------ */

/**
 * Calculates a guaranteed quote according to PRD transparent pricing:
 * Base Rental + Adjustments - Coupon Discount = Taxable Value
 * Taxable Value * Tax Rate = Tax
 * Rental Total = Taxable Value + Tax
 * Payable Now = Rental Total + Security Deposit
 */
export function calculateQuote(req: PricingRequest): PricingQuote {
  const { interval, timeZone, ratePlan, taxRule, couponDiscount } = req;
  const minutes = durationMinutes(interval);
  if (minutes <= 0) {
    throw new DomainError('INVALID_INPUT', 'Rental duration must be positive');
  }

  const rawHours = Math.ceil(minutes / 60);
  const billableHours = Math.max(rawHours, ratePlan.minHours);

  // Split period into 24-hour chunks + remaining hours
  const fullDays = Math.floor(billableHours / 24);
  const remainingHours = billableHours % 24;

  const lineItems: PricingLineItem[] = [];
  let dayCharges: Paise = 0;

  // Evaluate each 24-hour chunk based on its starting day in city timeZone
  for (let i = 0; i < fullDays; i++) {
    const chunkStart = new Date(interval.start.getTime() + i * 24 * 60 * 60 * 1000);
    const isoDate = toLocalIsoDate(chunkStart, timeZone);
    const { weekday } = getLocalParts(chunkStart, timeZone);
    const isWeekend = weekday === 0 || weekday === 6; // Sunday or Saturday

    let dayBaseRate = isWeekend ? ratePlan.weekendDailyRate : ratePlan.weekdayDailyRate;
    let label = `Day ${i + 1} (${isWeekend ? 'Weekend' : 'Weekday'})`;

    // Apply adjustments matching this calendar date
    const activeAdj = (req.adjustments ?? [])
      .filter((adj) => isoDate >= adj.startDate && isoDate <= adj.endDate)
      .sort((a, b) => b.priority - a.priority)[0];

    if (activeAdj) {
      if (activeAdj.mode === 'MULTIPLIER') {
        dayBaseRate = applyBps(dayBaseRate, activeAdj.value);
        label += ` [${activeAdj.name}]`;
      } else if (activeAdj.mode === 'OVERRIDE_DAILY') {
        dayBaseRate = activeAdj.value;
        label += ` [${activeAdj.name} special]`;
      }
    }

    assertPaise(dayBaseRate);
    dayCharges += dayBaseRate;
    lineItems.push({
      kind: 'RENTAL',
      label,
      amount: dayBaseRate,
      metadata: { date: isoDate, isWeekend },
    });
  }

  // Handle remaining partial hours: capped at 1 day rate
  let remainderCharge: Paise = 0;
  if (remainingHours > 0) {
    const chunkStart = new Date(interval.start.getTime() + fullDays * 24 * 60 * 60 * 1000);
    const { weekday } = getLocalParts(chunkStart, timeZone);
    const isWeekend = weekday === 0 || weekday === 6;
    const standardDaily = isWeekend ? ratePlan.weekendDailyRate : ratePlan.weekdayDailyRate;

    const hourlyTotal = remainingHours * ratePlan.hourlyRate;
    remainderCharge = Math.min(hourlyTotal, standardDaily);

    lineItems.push({
      kind: 'RENTAL',
      label: `Extra ${remainingHours} hr(s) (capped at daily)`,
      amount: remainderCharge,
      metadata: { remainingHours, hourlyRate: ratePlan.hourlyRate },
    });
  }

  const baseRental = sumPaise([dayCharges, remainderCharge]);

  // Apply Coupon Discount (if any, up to base rental)
  let discount: Paise = 0;
  let couponApplied: AppliedCoupon | null = null;
  if (couponDiscount && couponDiscount.discountAmount > 0) {
    discount = Math.min(couponDiscount.discountAmount, baseRental);
    couponApplied = { ...couponDiscount, discountAmount: discount };
    lineItems.push({
      kind: 'DISCOUNT',
      label: `Coupon: ${couponDiscount.code}`,
      amount: -discount,
      metadata: { code: couponDiscount.code },
    });
  }

  // Post-discount Taxable Value (GST compliant)
  const taxableValue = Math.max(0, baseRental - discount);
  const tax = applyBps(taxableValue, taxRule.rateBps);

  lineItems.push({
    kind: 'TAX',
    label: `${taxRule.name} (${taxRule.rateBps / 100}%)`,
    amount: tax,
  });

  const rentalTotal = taxableValue + tax;
  const securityDeposit = ratePlan.securityDeposit;

  lineItems.push({
    kind: 'DEPOSIT',
    label: 'Refundable Security Deposit',
    amount: securityDeposit,
    metadata: { refundable: true },
  });

  const payableNow = rentalTotal + securityDeposit;

  return {
    rentalDurationMinutes: minutes,
    billableHours,
    baseRental,
    discount,
    taxableValue,
    tax,
    rentalTotal,
    securityDeposit,
    payableNow,
    lineItems,
    coupon: couponApplied,
    ratePlanId: ratePlan.id,
  };
}
