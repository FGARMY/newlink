import { DomainError } from '../errors.js';

export interface HandoverChecklist {
  odometerKm: number;
  fuelLevelPercent: number;
  hasFastag: boolean;
  exteriorClean: boolean;
  interiorClean: boolean;
  spareWheelPresent: boolean;
  inspectionNotes?: string;
  verifiedByPasscode: boolean;
  handedOverAt: Date;
}

export interface ReturnInspection {
  returnOdometerKm: number;
  returnFuelLevelPercent: number;
  fastagTollPaise?: number;
  trafficViolationPaise?: number;
  damageDeductionPaise?: number;
  notes?: string;
  returnedAt: Date;
}

export interface DepositSettlement {
  originalDepositPaise: number;
  totalDeductionsPaise: number;
  deductionsBreakdown: {
    fastagTollsPaise: number;
    fuelDifferencePaise: number;
    damageOrFinePaise: number;
  };
  refundAmountPaise: number;
  status: 'SETTLED';
  settledAt: Date;
}

/**
 * Validates pickup handover checklist before allowing rental to become ACTIVE.
 */
export function validatePickupHandover(checklist: HandoverChecklist): void {
  if (checklist.odometerKm < 0) {
    throw new DomainError('INVALID_INPUT', 'Starting odometer cannot be negative');
  }
  if (checklist.fuelLevelPercent < 0 || checklist.fuelLevelPercent > 100) {
    throw new DomainError('INVALID_INPUT', 'Fuel level must be between 0% and 100%');
  }
  if (!checklist.verifiedByPasscode) {
    throw new DomainError('SECURITY_CHECK_FAILED', 'Pickup passcode must be verified before handover');
  }
}

/**
 * Computes security deposit settlement upon rental return.
 * Deductions:
 * 1. Fastag toll charges consumed during the rental trip.
 * 2. Fuel shortfall (if returned with significantly less fuel than start).
 * 3. Any damages or traffic fines logged during return inspection.
 */
export function calculateDepositSettlement(
  originalDepositPaise: number,
  startHandover: HandoverChecklist,
  returnInspection: ReturnInspection,
  fuelDiffRatePaisePerPercent: number = 2500, // ₹25 per 1% fuel (~ ₹100/liter)
): DepositSettlement {
  if (returnInspection.returnOdometerKm < startHandover.odometerKm) {
    throw new DomainError(
      'INVALID_INPUT',
      'Return odometer reading cannot be less than pickup odometer reading',
    );
  }

  const fastagTollsPaise = Math.max(0, returnInspection.fastagTollPaise || 0);
  const damageOrFinePaise = Math.max(
    0,
    (returnInspection.damageDeductionPaise || 0) + (returnInspection.trafficViolationPaise || 0),
  );

  // Calculate fuel penalty if returned lower than pickup
  let fuelDifferencePaise = 0;
  if (returnInspection.returnFuelLevelPercent < startHandover.fuelLevelPercent) {
    const fuelShortagePercent = startHandover.fuelLevelPercent - returnInspection.returnFuelLevelPercent;
    fuelDifferencePaise = fuelShortagePercent * fuelDiffRatePaisePerPercent;
  }

  const totalDeductionsPaise = Math.min(
    originalDepositPaise,
    fastagTollsPaise + fuelDifferencePaise + damageOrFinePaise,
  );

  const refundAmountPaise = Math.max(0, originalDepositPaise - totalDeductionsPaise);

  return {
    originalDepositPaise,
    totalDeductionsPaise,
    deductionsBreakdown: {
      fastagTollsPaise,
      fuelDifferencePaise,
      damageOrFinePaise,
    },
    refundAmountPaise,
    status: 'SETTLED',
    settledAt: new Date(),
  };
}
