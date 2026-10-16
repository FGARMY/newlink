import { DomainError } from '../errors.js';

/**
 * Timezone helpers built on Intl only (no dependency). Each City carries an IANA timezone,
 * so day boundaries (weekend pricing, opening hours) are always evaluated in city-local time
 * while storage stays in UTC.
 */

export interface LocalDateTimeParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let f = formatterCache.get(timeZone);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
      });
    } catch {
      throw new DomainError('INVALID_INPUT', `Unknown time zone: ${timeZone}`);
    }
    formatterCache.set(timeZone, f);
  }
  return f;
}

export function getLocalParts(date: Date, timeZone: string): LocalDateTimeParts {
  const parts = formatterFor(timeZone).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? '';
  const weekday = WEEKDAY_INDEX[get('weekday')];
  if (weekday === undefined) throw new DomainError('INVALID_INPUT', 'Unable to resolve weekday');
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')) % 24,
    minute: Number(get('minute')),
    second: Number(get('second')),
    weekday,
  };
}

const pad = (n: number, len = 2): string => String(n).padStart(len, '0');

/** City-local calendar date, e.g. `2026-10-10`. */
export function toLocalIsoDate(date: Date, timeZone: string): string {
  const p = getLocalParts(date, timeZone);
  return `${pad(p.year, 4)}-${pad(p.month)}-${pad(p.day)}`;
}

/** Minutes elapsed since local midnight (0–1439). */
export function localMinutesOfDay(date: Date, timeZone: string): number {
  const p = getLocalParts(date, timeZone);
  return p.hour * 60 + p.minute;
}

/** Offset of `timeZone` from UTC at `date`, in minutes (IST = +330). */
export function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const p = getLocalParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const truncated = Math.floor(date.getTime() / 1000) * 1000;
  return Math.round((asUtc - truncated) / 60_000);
}

const LOCAL_DATETIME_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

/**
 * Convert a city-local wall-clock time (`YYYY-MM-DDTHH:mm`) into an absolute instant.
 * Used for URL search params, which stay human-readable in the city's local time.
 */
export function zonedLocalToUtc(local: string, timeZone: string): Date {
  const m = LOCAL_DATETIME_RE.exec(local);
  if (!m) throw new DomainError('INVALID_INPUT', `Expected YYYY-MM-DDTHH:mm, got "${local}"`);
  const [y, mo, d, h, mi] = m.slice(1).map(Number) as [number, number, number, number, number];
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  const check = new Date(wall);
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== mo - 1 ||
    check.getUTCDate() !== d ||
    h > 23 ||
    mi > 59
  ) {
    throw new DomainError('INVALID_INPUT', `Invalid calendar date/time "${local}"`);
  }
  // Two-pass offset resolution handles zones with DST transitions.
  let guess = wall - getTimeZoneOffsetMinutes(new Date(wall), timeZone) * 60_000;
  guess = wall - getTimeZoneOffsetMinutes(new Date(guess), timeZone) * 60_000;
  return new Date(guess);
}

/** Inverse of {@link zonedLocalToUtc}: absolute instant → `YYYY-MM-DDTHH:mm` in city time. */
export function utcToZonedLocal(date: Date, timeZone: string): string {
  const p = getLocalParts(date, timeZone);
  return `${pad(p.year, 4)}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}
