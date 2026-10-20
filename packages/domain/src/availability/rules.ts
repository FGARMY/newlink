import { DomainError } from '../errors.js';
import type { Interval } from '../time/interval.js';
import { durationMinutes, extendEnd, makeInterval, overlaps } from '../time/interval.js';
import { localMinutesOfDay, getLocalParts } from '../time/zoned.js';

/* ------------------------------------------------------------------------------------------ */
/* Calendar blocks                                                                             */
/* ------------------------------------------------------------------------------------------ */

export const BLOCK_TYPES = ['HOLD', 'BOOKING', 'MAINTENANCE', 'ADMIN_BLOCK'] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

/**
 * One entry in a vehicle's calendar. `end` already includes the turnaround buffer, so a plain
 * half-open overlap test between blocks enforces the buffer in both directions.
 */
export interface VehicleBlock {
  readonly id: string;
  readonly vehicleId: string;
  readonly type: BlockType;
  readonly start: Date;
  readonly end: Date;
  readonly isActive: boolean;
  /** Only for HOLD blocks: after this instant the hold no longer blocks anyone. */
  readonly holdExpiresAt: Date | null;
  readonly bookingId: string | null;
}

/**
 * A block is "live" (blocks the vehicle) if it is active and, for holds, not yet expired.
 * Correctness never depends on a background sweeper having run.
 */
export function isBlockLive(block: VehicleBlock, now: Date): boolean {
  if (!block.isActive) return false;
  if (block.type === 'HOLD') {
    return block.holdExpiresAt !== null && block.holdExpiresAt.getTime() > now.getTime();
  }
  return true;
}

/** The interval a new rental will occupy in the calendar: `[start, end + buffer)`. */
export function blockingInterval(rental: Interval, bufferMinutes: number): Interval {
  if (bufferMinutes < 0) throw new DomainError('INVALID_INPUT', 'bufferMinutes must be >= 0');
  return extendEnd(rental, bufferMinutes);
}

export function findConflicts(
  blocks: readonly VehicleBlock[],
  candidate: Interval,
  now: Date,
): VehicleBlock[] {
  return blocks.filter((b) => isBlockLive(b, now) && overlaps(b, candidate));
}

/* ------------------------------------------------------------------------------------------ */
/* Booking window validation                                                                   */
/* ------------------------------------------------------------------------------------------ */

export interface BookingWindowPolicy {
  /** IANA zone of the city, e.g. Asia/Kolkata. */
  readonly timeZone: string;
  /** Minimum minutes between now and pickup. */
  readonly leadTimeMinutes: number;
  readonly minDurationMinutes: number;
  readonly maxDurationMinutes: number;
}

/** Opening hours for one weekday in minutes since local midnight. `closesAt` may be 1440. */
export interface OpeningHours {
  /** 0 = Sunday … 6 = Saturday */
  readonly dayOfWeek: number;
  readonly opensAt: number;
  readonly closesAt: number;
}

export interface BlackoutPeriod {
  readonly start: Date;
  readonly end: Date;
  readonly reason: string;
}

export const WINDOW_VIOLATIONS = [
  'END_BEFORE_START',
  'START_IN_PAST',
  'LEAD_TIME',
  'TOO_SHORT',
  'TOO_LONG',
  'PICKUP_OUTSIDE_HOURS',
  'RETURN_OUTSIDE_HOURS',
  'BLACKOUT',
] as const;
export type WindowViolationCode = (typeof WINDOW_VIOLATIONS)[number];

export interface WindowViolation {
  readonly code: WindowViolationCode;
  readonly message: string;
}

function isWithinHours(at: Date, hours: readonly OpeningHours[], timeZone: string): boolean {
  const weekday = getLocalParts(at, timeZone).weekday;
  const minutes = localMinutesOfDay(at, timeZone);
  return hours.some(
    (h) => h.dayOfWeek === weekday && minutes >= h.opensAt && minutes <= h.closesAt,
  );
}

/**
 * Validates a requested rental window against city policy, location hours and blackouts.
 * Returns every violation (not just the first) so the UI can explain all problems at once.
 */
export function validateBookingWindow(
  request: { start: Date; end: Date },
  policy: BookingWindowPolicy,
  hours: readonly OpeningHours[],
  blackouts: readonly BlackoutPeriod[],
  now: Date,
): WindowViolation[] {
  const violations: WindowViolation[] = [];
  if (request.end.getTime() <= request.start.getTime()) {
    return [{ code: 'END_BEFORE_START', message: 'Return time must be after pick-up time.' }];
  }
  const rental = makeInterval(request.start, request.end);
  const leadMs = policy.leadTimeMinutes * 60_000;

  if (request.start.getTime() < now.getTime()) {
    violations.push({ code: 'START_IN_PAST', message: 'Pick-up time is in the past.' });
  } else if (request.start.getTime() < now.getTime() + leadMs) {
    violations.push({
      code: 'LEAD_TIME',
      message: `Pick-up must be at least ${Math.round(policy.leadTimeMinutes / 60)} hour(s) from now.`,
    });
  }

  const minutes = durationMinutes(rental);
  if (minutes < policy.minDurationMinutes) {
    violations.push({
      code: 'TOO_SHORT',
      message: `Minimum rental duration is ${Math.round(policy.minDurationMinutes / 60)} hours.`,
    });
  }
  if (minutes > policy.maxDurationMinutes) {
    violations.push({
      code: 'TOO_LONG',
      message: `Maximum rental duration is ${Math.round(policy.maxDurationMinutes / 1440)} days.`,
    });
  }

  if (hours.length > 0) {
    if (!isWithinHours(request.start, hours, policy.timeZone)) {
      violations.push({
        code: 'PICKUP_OUTSIDE_HOURS',
        message: 'Pick-up time is outside this location’s operating hours.',
      });
    }
    if (!isWithinHours(request.end, hours, policy.timeZone)) {
      violations.push({
        code: 'RETURN_OUTSIDE_HOURS',
        message: 'Return time is outside this location’s operating hours.',
      });
    }
  }

  const hit = blackouts.find((b) => overlaps(b, rental));
  if (hit) {
    violations.push({
      code: 'BLACKOUT',
      message: `Unavailable during this period: ${hit.reason}.`,
    });
  }

  return violations;
}
