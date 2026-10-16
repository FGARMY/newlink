import { DomainError } from '../errors.js';

export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

/** Half-open time interval `[start, end)` in absolute (UTC) time. */
export interface Interval {
  readonly start: Date;
  readonly end: Date;
}

export function makeInterval(start: Date, end: Date): Interval {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new DomainError('INVALID_INPUT', 'Interval dates must be valid');
  }
  if (end.getTime() <= start.getTime()) {
    throw new DomainError('INVALID_INPUT', 'Interval end must be after start');
  }
  return { start, end };
}

/** True when two half-open intervals share at least one instant. Touching edges do NOT overlap. */
export function overlaps(a: Interval, b: Interval): boolean {
  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
}

export function extendEnd(i: Interval, minutes: number): Interval {
  return { start: i.start, end: new Date(i.end.getTime() + minutes * MINUTE_MS) };
}

export function durationMinutes(i: Interval): number {
  return Math.round((i.end.getTime() - i.start.getTime()) / MINUTE_MS);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MINUTE_MS);
}
