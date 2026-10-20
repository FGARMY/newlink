import { DomainError } from '../errors.js';
import { type Paise, applyBps } from '../money.js';

export interface CouponRule {
  readonly id: string;
  readonly code: string;
  readonly type: 'PERCENT' | 'FIXED';
  /** If PERCENT, basis points (e.g. 1500 = 15%). If FIXED, paise. */
  readonly value: number;
  readonly maxDiscountPaise?: Paise;
  readonly minBookingAmountPaise?: Paise;
  readonly validFrom: Date;
  readonly validTo: Date;
  readonly totalUsageLimit?: number;
  readonly perCustomerLimit?: number;
  readonly cityIds?: readonly string[];
  readonly categoryIds?: readonly string[];
  readonly vehicleIds?: readonly string[];
  readonly isActive: boolean;
}

export interface CouponValidationContext {
  readonly baseRentalPaise: Paise;
  readonly cityId: string;
  readonly categoryId: string;
  readonly vehicleId: string;
  readonly customerId: string;
  readonly customerPriorUsages: number;
  readonly totalPriorUsages: number;
  readonly now: Date;
}

export function validateAndComputeDiscount(
  coupon: CouponRule,
  ctx: CouponValidationContext,
): Paise {
  if (!coupon.isActive) {
    throw new DomainError('COUPON_INVALID', 'Coupon is not active');
  }

  if (
    ctx.now.getTime() < coupon.validFrom.getTime() ||
    ctx.now.getTime() > coupon.validTo.getTime()
  ) {
    throw new DomainError('COUPON_INVALID', 'Coupon has expired or is not yet valid');
  }

  if (coupon.cityIds && coupon.cityIds.length > 0 && !coupon.cityIds.includes(ctx.cityId)) {
    throw new DomainError('COUPON_INVALID', 'Coupon is not valid in this city');
  }

  if (
    coupon.categoryIds &&
    coupon.categoryIds.length > 0 &&
    !coupon.categoryIds.includes(ctx.categoryId)
  ) {
    throw new DomainError('COUPON_INVALID', 'Coupon is not valid for this vehicle category');
  }

  if (
    coupon.vehicleIds &&
    coupon.vehicleIds.length > 0 &&
    !coupon.vehicleIds.includes(ctx.vehicleId)
  ) {
    throw new DomainError('COUPON_INVALID', 'Coupon is not valid for this vehicle');
  }

  if (coupon.minBookingAmountPaise && ctx.baseRentalPaise < coupon.minBookingAmountPaise) {
    throw new DomainError(
      'COUPON_INVALID',
      `Minimum rental amount of ₹${coupon.minBookingAmountPaise / 100} required for this coupon`,
    );
  }

  if (coupon.totalUsageLimit !== undefined && ctx.totalPriorUsages >= coupon.totalUsageLimit) {
    throw new DomainError('COUPON_INVALID', 'Coupon maximum global usage limit reached');
  }

  if (coupon.perCustomerLimit !== undefined && ctx.customerPriorUsages >= coupon.perCustomerLimit) {
    throw new DomainError(
      'COUPON_INVALID',
      'You have already used this coupon maximum number of times',
    );
  }

  let discountPaise: Paise = 0;
  if (coupon.type === 'FIXED') {
    discountPaise = Math.min(coupon.value, ctx.baseRentalPaise);
  } else if (coupon.type === 'PERCENT') {
    discountPaise = applyBps(ctx.baseRentalPaise, coupon.value);
    if (coupon.maxDiscountPaise !== undefined) {
      discountPaise = Math.min(discountPaise, coupon.maxDiscountPaise);
    }
  }

  return discountPaise;
}
