import { DomainError } from '../errors.js';

export const VEHICLE_OPS_STATUSES = ['IN_SERVICE', 'MAINTENANCE', 'INACTIVE'] as const;
export type VehicleOpsStatus = (typeof VEHICLE_OPS_STATUSES)[number];

export const VEHICLE_DOCUMENT_TYPES = [
  'REGISTRATION_CERTIFICATE',
  'COMMERCIAL_INSURANCE',
  'POLLUTION_UNDER_CONTROL',
  'COMMERCIAL_PERMIT',
] as const;
export type VehicleDocumentType = (typeof VEHICLE_DOCUMENT_TYPES)[number];

export interface VehicleDocumentStatus {
  readonly type: VehicleDocumentType;
  readonly documentNumber: string;
  readonly expiresOn: Date; // UTC
}

export interface ComplianceCheckResult {
  readonly isRoadLegal: boolean;
  readonly hasExpiredDocuments: boolean;
  readonly expiringSoon: readonly VehicleDocumentType[];
  readonly violations: readonly string[];
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Validates that all statutory vehicle documents (RC, Insurance, PUC) are current.
 * Expired commercial insurance or PUC immediately marks a car not road-legal.
 */
export function checkVehicleCompliance(
  docs: readonly VehicleDocumentStatus[],
  now: Date = new Date(),
): ComplianceCheckResult {
  const violations: string[] = [];
  const expiringSoon: VehicleDocumentType[] = [];
  let hasExpired = false;

  const insurance = docs.find((d) => d.type === 'COMMERCIAL_INSURANCE');
  if (!insurance) {
    violations.push('Missing commercial self-drive insurance document');
    hasExpired = true;
  } else if (insurance.expiresOn.getTime() < now.getTime()) {
    violations.push('Commercial insurance has EXPIRED');
    hasExpired = true;
  } else if (insurance.expiresOn.getTime() - now.getTime() < SEVEN_DAYS_MS) {
    expiringSoon.push('COMMERCIAL_INSURANCE');
  }

  const puc = docs.find((d) => d.type === 'POLLUTION_UNDER_CONTROL');
  if (!puc) {
    violations.push('Missing PUC certificate');
    hasExpired = true;
  } else if (puc.expiresOn.getTime() < now.getTime()) {
    violations.push('PUC certificate has EXPIRED');
    hasExpired = true;
  } else if (puc.expiresOn.getTime() - now.getTime() < SEVEN_DAYS_MS) {
    expiringSoon.push('POLLUTION_UNDER_CONTROL');
  }

  const rc = docs.find((d) => d.type === 'REGISTRATION_CERTIFICATE');
  if (!rc) {
    violations.push('Missing vehicle registration certificate (RC)');
    hasExpired = true;
  }

  return {
    isRoadLegal: violations.length === 0,
    hasExpiredDocuments: hasExpired,
    expiringSoon,
    violations,
  };
}

export function canTransitionOpsStatus(
  from: VehicleOpsStatus,
  to: VehicleOpsStatus,
  hasActiveRentals = false,
): boolean {
  if (from === to) return true;
  // Cannot switch directly to INACTIVE if a customer is currently driving it
  if (to === 'INACTIVE' && hasActiveRentals) {
    return false;
  }
  return true;
}

export function assertOpsStatusTransition(
  from: VehicleOpsStatus,
  to: VehicleOpsStatus,
  hasActiveRentals = false,
): void {
  if (!canTransitionOpsStatus(from, to, hasActiveRentals)) {
    throw new DomainError(
      'INVALID_STATE_TRANSITION',
      `Cannot mark vehicle ${to} while active rentals are in progress`,
    );
  }
}
