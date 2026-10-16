import { DomainError } from '../errors.js';
import { type Paise, assertPaise } from '../money.js';

export type DisputeReason =
  | 'FASTAG_MISMATCH'
  | 'PRE_EXISTING_SCRATCH'
  | 'FUEL_READING_INCORRECT'
  | 'CLEANING_FEE_CONTESTED'
  | 'OTHER';

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'REFUND_APPROVED' | 'REJECTED';

export interface DepositDispute {
  readonly id: string;
  readonly bookingReference: string;
  readonly vehicleId: string;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly reason: DisputeReason;
  readonly claimedRefundPaise: Paise;
  readonly customerNotes: string;
  readonly status: DisputeStatus;
  readonly resolutionNotes?: string;
  readonly approvedRefundPaise?: Paise;
  readonly createdAt: Date;
  readonly resolvedAt?: Date;
}

export function validateDisputeClaim(
  claimedRefundPaise: Paise,
  totalDeductionsPaise: Paise,
  customerNotes: string,
): void {
  assertPaise(claimedRefundPaise);
  assertPaise(totalDeductionsPaise);

  if (claimedRefundPaise <= 0) {
    throw new DomainError('INVALID_INPUT', 'Claimed dispute refund must be greater than zero');
  }

  if (claimedRefundPaise > totalDeductionsPaise) {
    throw new DomainError(
      'INVALID_INPUT',
      'Claimed dispute refund cannot exceed total deductions amount',
    );
  }

  if (!customerNotes || customerNotes.trim().length < 10) {
    throw new DomainError('INVALID_INPUT', 'Please provide detailed explanation (at least 10 characters)');
  }
}

export function resolveDepositDispute(
  dispute: DepositDispute,
  action: 'APPROVE' | 'REJECT',
  approvedRefundPaise: Paise,
  resolutionNotes: string,
): DepositDispute {
  if (dispute.status !== 'OPEN' && dispute.status !== 'UNDER_REVIEW') {
    throw new DomainError('INVALID_STATE_TRANSITION', 'Dispute has already been resolved');
  }

  if (action === 'APPROVE') {
    assertPaise(approvedRefundPaise);
    if (approvedRefundPaise <= 0 || approvedRefundPaise > dispute.claimedRefundPaise) {
      throw new DomainError(
        'INVALID_INPUT',
        'Approved refund must be positive and cannot exceed claimed amount',
      );
    }

    return {
      ...dispute,
      status: 'REFUND_APPROVED',
      approvedRefundPaise,
      resolutionNotes: resolutionNotes || 'Dispute approved following operations review',
      resolvedAt: new Date(),
    };
  }

  return {
    ...dispute,
    status: 'REJECTED',
    approvedRefundPaise: 0 as Paise,
    resolutionNotes: resolutionNotes || 'Dispute reviewed and deductions confirmed accurate',
    resolvedAt: new Date(),
  };
}
