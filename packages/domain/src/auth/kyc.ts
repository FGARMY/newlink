import { DomainError } from '../errors.js';

export const KYC_STATUSES = [
  'NOT_SUBMITTED',
  'PENDING_REVIEW',
  'APPROVED',
  'REJECTED',
] as const;
export type KycStatus = (typeof KYC_STATUSES)[number];

export const KYC_DOCUMENT_TYPES = [
  'DRIVING_LICENSE',
  'AADHAAR_CARD',
  'PASSPORT',
] as const;
export type KycDocumentType = (typeof KYC_DOCUMENT_TYPES)[number];

export function canTransitionKyc(from: KycStatus, to: KycStatus): boolean {
  switch (from) {
    case 'NOT_SUBMITTED':
      return to === 'PENDING_REVIEW';
    case 'PENDING_REVIEW':
      return to === 'APPROVED' || to === 'REJECTED';
    case 'REJECTED':
      return to === 'PENDING_REVIEW'; // Resubmission
    case 'APPROVED':
      return to === 'REJECTED' || to === 'PENDING_REVIEW'; // Revocation or expired license
    default:
      return false;
  }
}

export function assertKycTransition(from: KycStatus, to: KycStatus): void {
  if (!canTransitionKyc(from, to)) {
    throw new DomainError('INVALID_STATE_TRANSITION', `KYC status cannot transition from ${from} to ${to}`);
  }
}
