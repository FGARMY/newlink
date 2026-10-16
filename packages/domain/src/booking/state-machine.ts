import { DomainError } from '../errors.js';

/**
 * Booking lifecycle (design doc §5). Money state is tracked separately in PaymentStatus so a
 * COMPLETED booking can still have a pending deposit refund.
 */
export const BOOKING_STATUSES = [
  'DRAFT',
  'PAYMENT_PENDING',
  'CONFIRMED',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
  'FAILED',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
  'UNPAID',
  'PAID',
  'REFUND_PENDING',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
  'REFUND_FAILED',
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const BOOKING_TRANSITIONS: Readonly<Record<BookingStatus, readonly BookingStatus[]>> = {
  DRAFT: ['PAYMENT_PENDING', 'FAILED'],
  PAYMENT_PENDING: ['CONFIRMED', 'EXPIRED', 'CANCELLED'],
  // Late but verified payment: re-reserve succeeds → CONFIRMED, slot taken → FAILED (+ refund).
  EXPIRED: ['CONFIRMED', 'FAILED'],
  CONFIRMED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: [],
};

const PAYMENT_TRANSITIONS: Readonly<Record<PaymentStatus, readonly PaymentStatus[]>> = {
  UNPAID: ['PAID'],
  PAID: ['REFUND_PENDING'],
  REFUND_PENDING: ['PARTIALLY_REFUNDED', 'REFUNDED', 'REFUND_FAILED'],
  PARTIALLY_REFUNDED: ['REFUND_PENDING'],
  REFUND_FAILED: ['REFUND_PENDING'],
  REFUNDED: [],
};

/** Statuses whose calendar block must stay active (vehicle unavailable to others). */
export const BLOCKING_BOOKING_STATUSES: readonly BookingStatus[] = [
  'PAYMENT_PENDING',
  'CONFIRMED',
  'ACTIVE',
];

export function allowedBookingTransitions(from: BookingStatus): readonly BookingStatus[] {
  return BOOKING_TRANSITIONS[from];
}

export function canTransitionBooking(from: BookingStatus, to: BookingStatus): boolean {
  return BOOKING_TRANSITIONS[from].includes(to);
}

export function assertBookingTransition(from: BookingStatus, to: BookingStatus): void {
  if (!canTransitionBooking(from, to)) {
    throw new DomainError(
      'INVALID_STATE_TRANSITION',
      `Booking cannot move from ${from} to ${to}`,
      { from, to, allowed: BOOKING_TRANSITIONS[from] },
    );
  }
}

export function isTerminalBookingStatus(status: BookingStatus): boolean {
  return BOOKING_TRANSITIONS[status].length === 0;
}

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus): boolean {
  return PAYMENT_TRANSITIONS[from].includes(to);
}

export function assertPaymentTransition(from: PaymentStatus, to: PaymentStatus): void {
  if (!canTransitionPayment(from, to)) {
    throw new DomainError(
      'INVALID_STATE_TRANSITION',
      `Payment status cannot move from ${from} to ${to}`,
      { from, to, allowed: PAYMENT_TRANSITIONS[from] },
    );
  }
}
