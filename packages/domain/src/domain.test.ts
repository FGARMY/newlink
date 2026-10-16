import { describe, expect, it } from 'vitest';
import {
  assertBookingTransition,
  canTransitionBooking,
  assertPaymentTransition,
  canTransitionPayment,
  generateBookingReference,
  isBookingReference,
  makeInterval,
  overlaps,
  extendEnd,
  calculateQuote,
  type RatePlan,
  type TaxRule,
  isBlockLive,
  type VehicleBlock,
  validateAndComputeDiscount,
  type CouponRule,
  createOtpChallenge,
  verifyOtpChallenge,
  hasPermission,
  checkVehicleCompliance,
  createPaymentOrder,
  verifyPaymentIntegrity,
  validatePickupHandover,
  calculateDepositSettlement,
  calculateFleetOccupancy,
  calculateRevPAC,
  aggregateCityMetrics,
  calculateReviewSummary,
  validateCustomerReview,
  resolveDepositDispute,
  validateDisputeClaim,
} from './index.js';

describe('Booking State Machine', () => {
  it('allows valid lifecycle transitions', () => {
    expect(canTransitionBooking('DRAFT', 'PAYMENT_PENDING')).toBe(true);
    expect(canTransitionBooking('PAYMENT_PENDING', 'CONFIRMED')).toBe(true);
    expect(canTransitionBooking('CONFIRMED', 'ACTIVE')).toBe(true);
    expect(canTransitionBooking('ACTIVE', 'COMPLETED')).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(canTransitionBooking('DRAFT', 'CONFIRMED')).toBe(false);
    expect(canTransitionBooking('COMPLETED', 'ACTIVE')).toBe(false);
    expect(() => assertBookingTransition('COMPLETED', 'CONFIRMED')).toThrow();
  });

  it('allows late confirmed payments from expired hold', () => {
    expect(canTransitionBooking('EXPIRED', 'CONFIRMED')).toBe(true);
    expect(canTransitionBooking('EXPIRED', 'FAILED')).toBe(true);
  });
});

describe('Booking Reference Generator', () => {
  it('creates clean readable non-sequential references', () => {
    const ref = generateBookingReference('NL', 'PN');
    expect(isBookingReference(ref)).toBe(true);
    expect(ref.startsWith('NL-PN-')).toBe(true);
    expect(ref).not.toMatch(/[IOU]/); // No visually confusing characters
  });
});

describe('Availability & Interval Math', () => {
  it('detects half-open overlaps correctly without edge collisions', () => {
    const i1 = makeInterval(new Date('2026-10-10T10:00:00Z'), new Date('2026-10-10T14:00:00Z'));
    const i2 = makeInterval(new Date('2026-10-10T14:00:00Z'), new Date('2026-10-10T18:00:00Z'));
    const i3 = makeInterval(new Date('2026-10-10T13:00:00Z'), new Date('2026-10-10T15:00:00Z'));

    // Touching edges do not overlap
    expect(overlaps(i1, i2)).toBe(false);
    // Overlapping ranges
    expect(overlaps(i1, i3)).toBe(true);
  });

  it('evaluates hold block expiry dynamically', () => {
    const now = new Date('2026-10-10T10:00:00Z');
    const liveHold: VehicleBlock = {
      id: 'b1',
      vehicleId: 'v1',
      type: 'HOLD',
      start: new Date('2026-10-11T10:00:00Z'),
      end: new Date('2026-10-12T10:00:00Z'),
      isActive: true,
      holdExpiresAt: new Date('2026-10-10T10:05:00Z'), // 5 mins in future
      bookingId: 'bk1',
    };
    expect(isBlockLive(liveHold, now)).toBe(true);

    const expiredHold: VehicleBlock = {
      ...liveHold,
      holdExpiresAt: new Date('2026-10-10T09:55:00Z'), // 5 mins in past
    };
    expect(isBlockLive(expiredHold, now)).toBe(false);
  });
});

describe('Pricing Engine', () => {
  const ratePlan: RatePlan = {
    id: 'rp-creta',
    scope: 'MODEL',
    scopeId: 'm-creta',
    cityId: 'c-pune',
    hourlyRate: 15000,        // ₹150 / hr
    weekdayDailyRate: 200000, // ₹2,000 / day
    weekendDailyRate: 250000, // ₹2,500 / day
    securityDeposit: 500000,  // ₹5,000
    minHours: 8,
  };

  const taxRule: TaxRule = {
    id: 'gst-18',
    name: 'GST',
    rateBps: 1800, // 18%
  };

  it('calculates pricing for a multi-day booking with coupon discount and GST', () => {
    // 2 days (Weekday: Tue to Thu)
    const interval = makeInterval(
      new Date('2026-10-13T10:00:00Z'),
      new Date('2026-10-15T10:00:00Z'),
    );

    const quote = calculateQuote({
      interval,
      timeZone: 'Asia/Kolkata',
      ratePlan,
      taxRule,
      couponDiscount: {
        id: 'c1',
        code: 'WELCOME500',
        discountAmount: 50000, // ₹500
      },
    });

    // 2 days weekday @ ₹2000 = ₹4,000 = 400000 paise
    expect(quote.baseRental).toBe(400000);
    expect(quote.discount).toBe(50000);
    // Taxable = 400000 - 50000 = 350000 paise (₹3,500)
    expect(quote.taxableValue).toBe(350000);
    // Tax = 18% of 350000 = 63000 paise (₹630)
    expect(quote.tax).toBe(63000);
    // Rental total = 350000 + 63000 = 413000 paise (₹4,130)
    expect(quote.rentalTotal).toBe(413000);
    // Deposit = ₹5000 = 500000 paise
    expect(quote.securityDeposit).toBe(500000);
    // Payable now = 413000 + 500000 = 913000 paise (₹9,130)
    expect(quote.payableNow).toBe(913000);
  });
});

describe('Authentication, OTP & RBAC', () => {
  it('creates and verifies a 6-digit OTP challenge', () => {
    const phone = '+919876543210';
    const otp = '482915';
    const challenge = createOtpChallenge(phone, otp, 300);

    // Valid check
    const valid = verifyOtpChallenge(challenge, otp);
    expect(valid.success).toBe(true);

    // Invalid check
    const invalid = verifyOtpChallenge(challenge, '123456');
    expect(invalid.success).toBe(false);

    // Expired check
    const expiredNow = new Date(Date.now() + 400 * 1000);
    const expired = verifyOtpChallenge(challenge, otp, expiredNow);
    expect(expired.success).toBe(false);
    expect(expired.error).toContain('expired');
  });

  it('enforces RBAC permissions per role', () => {
    expect(hasPermission('SUPER_ADMIN', 'staff:manage')).toBe(true);
    expect(hasPermission('ADMIN', 'vehicles:write')).toBe(true);
    expect(hasPermission('ADMIN', 'staff:manage')).toBe(false);
    expect(hasPermission('FLEET_MANAGER', 'vehicles:write')).toBe(true);
    expect(hasPermission('FLEET_MANAGER', 'pricing:write')).toBe(false);
    expect(hasPermission('SUPPORT', 'bookings:read')).toBe(true);
    expect(hasPermission('SUPPORT', 'vehicles:write')).toBe(false);
  });
});

describe('Fleet Compliance & Operational Rules', () => {
  it('validates road legality based on RC, Commercial Insurance, and PUC dates', () => {
    const now = new Date('2026-10-10T00:00:00Z');
    const validDocs = [
      {
        type: 'REGISTRATION_CERTIFICATE' as const,
        documentNumber: 'MH-12-RN-4821',
        expiresOn: new Date('2039-10-10T00:00:00Z'),
      },
      {
        type: 'COMMERCIAL_INSURANCE' as const,
        documentNumber: 'POL-99214',
        expiresOn: new Date('2027-01-01T00:00:00Z'),
      },
      {
        type: 'POLLUTION_UNDER_CONTROL' as const,
        documentNumber: 'PUC-4421',
        expiresOn: new Date('2026-12-01T00:00:00Z'),
      },
    ];

    const validCheck = checkVehicleCompliance(validDocs, now);
    expect(validCheck.isRoadLegal).toBe(true);
    expect(validCheck.hasExpiredDocuments).toBe(false);

    // If insurance is expired
    const expiredInsuranceDocs = [
      validDocs[0]!,
      {
        type: 'COMMERCIAL_INSURANCE' as const,
        documentNumber: 'POL-99214',
        expiresOn: new Date('2026-09-01T00:00:00Z'), // expired in past
      },
      validDocs[2]!,
    ];
    const invalidCheck = checkVehicleCompliance(expiredInsuranceDocs, now);
    expect(invalidCheck.isRoadLegal).toBe(false);
    expect(invalidCheck.hasExpiredDocuments).toBe(true);
    expect(invalidCheck.violations[0]).toContain('Commercial insurance has EXPIRED');
  });
});

describe('Payment Engine & Order Lifecycle', () => {
  it('creates valid normalized payment order', () => {
    const order = createPaymentOrder('NL-PN-Q2KCA6', 450000);
    expect(order.orderId).toContain('order_');
    expect(order.bookingReference).toBe('NL-PN-Q2KCA6');
    expect(order.amountPaise).toBe(450000);
    expect(order.currency).toBe('INR');
    expect(order.status).toBe('CREATED');
  });

  it('rejects non-positive order amounts', () => {
    expect(() => createPaymentOrder('NL-PN-Q2KCA6', 0)).toThrow();
    expect(() => createPaymentOrder('NL-PN-Q2KCA6', -100)).toThrow();
  });

  it('verifies payment integrity correctly', () => {
    expect(
      verifyPaymentIntegrity({
        orderId: 'order_test_123',
        paymentId: 'pay_test_456',
        method: 'UPI',
      }),
    ).toBe(true);

    expect(
      verifyPaymentIntegrity({
        orderId: 'invalid_order',
        paymentId: 'pay_test_456',
        method: 'UPI',
      }),
    ).toBe(false);
  });
});

describe('Digital Handover & Security Deposit Settlement', () => {
  const startHandover = {
    odometerKm: 14200,
    fuelLevelPercent: 100,
    hasFastag: true,
    exteriorClean: true,
    interiorClean: true,
    spareWheelPresent: true,
    verifiedByPasscode: true,
    handedOverAt: new Date('2026-10-10T10:00:00Z'),
  };

  it('validates start handover parameters', () => {
    expect(() => validatePickupHandover(startHandover)).not.toThrow();
    expect(() =>
      validatePickupHandover({
        ...startHandover,
        verifiedByPasscode: false,
      }),
    ).toThrow('Pickup passcode must be verified');
  });

  it('computes full deposit refund when car is returned in clean condition', () => {
    const returnInspection = {
      returnOdometerKm: 14500, // 300 km driven
      returnFuelLevelPercent: 100,
      fastagTollPaise: 0,
      returnedAt: new Date('2026-10-11T18:00:00Z'),
    };

    const settlement = calculateDepositSettlement(500000, startHandover, returnInspection);
    expect(settlement.originalDepositPaise).toBe(500000);
    expect(settlement.totalDeductionsPaise).toBe(0);
    expect(settlement.refundAmountPaise).toBe(500000);
    expect(settlement.status).toBe('SETTLED');
  });

  it('calculates deductions for Fastag tolls, fuel difference, and minor fines', () => {
    const returnInspection = {
      returnOdometerKm: 14650,
      returnFuelLevelPercent: 80, // 20% shortage -> 20 * 2500 = 50,000 paise (₹500)
      fastagTollPaise: 35000,     // ₹350 in tolls
      damageDeductionPaise: 50000, // ₹500 cleaning/scratch charge
      returnedAt: new Date('2026-10-11T18:00:00Z'),
    };

    const settlement = calculateDepositSettlement(500000, startHandover, returnInspection);
    // Tolls: 35000 + Fuel: 50000 + Damage: 50000 = 135000 paise (₹1,350)
    expect(settlement.totalDeductionsPaise).toBe(135000);
    expect(settlement.refundAmountPaise).toBe(365000); // ₹3,650 refunded
    expect(settlement.deductionsBreakdown.fastagTollsPaise).toBe(35000);
    expect(settlement.deductionsBreakdown.fuelDifferencePaise).toBe(50000);
  });
});

describe('Promotions & Coupon Validation Engine', () => {
  const sampleCoupon: CouponRule = {
    id: 'coup-1',
    code: 'PUNE10',
    type: 'PERCENT',
    value: 1000, // 10%
    maxDiscountPaise: 100000, // max ₹1,000
    minBookingAmountPaise: 200000, // min ₹2,000
    validFrom: new Date('2026-01-01'),
    validTo: new Date('2027-01-01'),
    isActive: true,
    cityIds: ['city-pune'],
  };

  it('applies percentage coupon correctly within max discount cap', () => {
    const discount = validateAndComputeDiscount(sampleCoupon, {
      baseRentalPaise: 400000, // ₹4,000 -> 10% is ₹400 = 40,000 paise
      cityId: 'city-pune',
      categoryId: 'cat-suv',
      vehicleId: 'veh-1',
      customerId: 'cust-1',
      customerPriorUsages: 0,
      totalPriorUsages: 5,
      now: new Date('2026-06-01'),
    });
    expect(discount).toBe(40000);
  });

  it('rejects coupon if minimum rental amount is not met', () => {
    expect(() =>
      validateAndComputeDiscount(sampleCoupon, {
        baseRentalPaise: 150000, // ₹1,500 < ₹2,000
        cityId: 'city-pune',
        categoryId: 'cat-suv',
        vehicleId: 'veh-1',
        customerId: 'cust-1',
        customerPriorUsages: 0,
        totalPriorUsages: 5,
        now: new Date('2026-06-01'),
      }),
    ).toThrow();
  });

  it('rejects coupon if outside permitted city', () => {
    expect(() =>
      validateAndComputeDiscount(sampleCoupon, {
        baseRentalPaise: 300000,
        cityId: 'city-nashik', // not Pune
        categoryId: 'cat-suv',
        vehicleId: 'veh-1',
        customerId: 'cust-1',
        customerPriorUsages: 0,
        totalPriorUsages: 5,
        now: new Date('2026-06-01'),
      }),
    ).toThrow();
  });
});

describe('Fleet Analytics & RevPAC Calculations', () => {
  it('computes occupancy and serviceability rates accurately', () => {
    const stats = calculateFleetOccupancy({
      totalVehicles: 20,
      rentedVehicles: 15,
      maintenanceVehicles: 2,
    });
    expect(stats.total).toBe(20);
    expect(stats.maintenance).toBe(2);
    expect(stats.rented).toBe(15);
    expect(stats.available).toBe(3);
    // In service: 18. Rented: 15/18 = 83.3%
    expect(stats.occupancyRatePercent).toBe(83.3);
    // Serviceability: 18/20 = 90.0%
    expect(stats.serviceabilityPercent).toBe(90.0);
  });

  it('computes RevPAC per in-service vehicle in integer paise', () => {
    const revPac = calculateRevPAC(54000000, 18); // ₹540,000 across 18 available cars
    expect(revPac).toBe(3000000); // ₹30,000 per car
  });

  it('aggregates city metrics properly across multiple hubs', () => {
    const citiesData = [
      {
        id: 'city-pune',
        name: 'Pune',
        vehicles: [
          { status: 'IN_SERVICE' as const, isRented: true },
          { status: 'IN_SERVICE' as const, isRented: true },
          { status: 'IN_SERVICE' as const, isRented: false },
          { status: 'MAINTENANCE' as const, isRented: false },
        ],
        revenuePaise: 3600000, // ₹36,000
      },
      {
        id: 'city-nashik',
        name: 'Nashik',
        vehicles: [
          { status: 'IN_SERVICE' as const, isRented: true },
          { status: 'IN_SERVICE' as const, isRented: false },
        ],
        revenuePaise: 1800000, // ₹18,000
      },
    ];

    const results = aggregateCityMetrics(citiesData);
    expect(results).toHaveLength(2);
    expect(results[0]?.cityName).toBe('Pune');
    expect(results[0]?.totalFleet).toBe(4);
    expect(results[0]?.activeRentals).toBe(2);
    // Pune in-service: 3. Rented: 2/3 = 66.7%
    expect(results[0]?.occupancyRatePercent).toBe(66.7);
    expect(results[1]?.cityName).toBe('Nashik');
    expect(results[1]?.occupancyRatePercent).toBe(50.0);
  });
});

describe('Customer Reviews & Rating Scoring Engine', () => {
  it('validates review ratings boundaries', () => {
    expect(() =>
      validateCustomerReview({
        vehicleId: 'veh-creta-pn',
        bookingReference: 'NL-PN-7K3Q9M',
        customerName: 'Aditya Kulkarni',
        customerCity: 'Pune',
        overallRating: 6, // invalid
        cleanlinessRating: 5,
        conditionRating: 5,
        handoverRating: 5,
        comment: 'Great ride!',
      }),
    ).toThrow();
  });

  it('aggregates multi-criteria ratings into category averages', () => {
    const reviews = [
      {
        id: 'rev-1',
        vehicleId: 'veh-creta-pn',
        bookingReference: 'NL-PN-7K3Q9M',
        customerName: 'Aditya K',
        customerCity: 'Pune',
        overallRating: 5,
        cleanlinessRating: 5,
        conditionRating: 4,
        handoverRating: 5,
        comment: 'Super clean vehicle, smooth handover.',
        createdAt: new Date(),
      },
      {
        id: 'rev-2',
        vehicleId: 'veh-creta-pn',
        bookingReference: 'NL-PN-8X2Y1Z',
        customerName: 'Neha S',
        customerCity: 'Mumbai',
        overallRating: 4,
        cleanlinessRating: 4,
        conditionRating: 5,
        handoverRating: 4,
        comment: 'Great trip to Lonavala, car was in top condition.',
        createdAt: new Date(),
      },
    ];

    const summary = calculateReviewSummary(reviews);
    expect(summary.ratingCount).toBe(2);
    expect(summary.ratingAvg).toBe(4.5);
    expect(summary.cleanlinessAvg).toBe(4.5);
    expect(summary.conditionAvg).toBe(4.5);
    expect(summary.handoverAvg).toBe(4.5);
  });
});

describe('Damage & Deposit Dispute Resolution', () => {
  it('validates dispute claim amount cannot exceed total deductions', () => {
    expect(() =>
      validateDisputeClaim(
        60000, // claiming ₹600
        50000, // total deduction was only ₹500
        'I want full refund for incorrect fuel charge',
      ),
    ).toThrow();
  });

  it('approves refund adjustment and resolves dispute', () => {
    const dispute = {
      id: 'disp-1',
      bookingReference: 'NL-PN-7K3Q9M',
      vehicleId: 'veh-creta-pn',
      customerName: 'Aditya K',
      customerPhone: '+91 98765 43210',
      reason: 'FASTAG_MISMATCH' as const,
      claimedRefundPaise: 35000, // ₹350
      customerNotes: 'Khed Shivapur toll plaza charged twice due to scanner delay',
      status: 'OPEN' as const,
      createdAt: new Date(),
    };

    const resolved = resolveDepositDispute(
      dispute,
      'APPROVE',
      35000,
      'Verified FASTAG transaction log, duplicate toll reversed',
    );

    expect(resolved.status).toBe('REFUND_APPROVED');
    expect(resolved.approvedRefundPaise).toBe(35000);
    expect(resolved.resolutionNotes).toContain('duplicate toll reversed');
    expect(resolved.resolvedAt).toBeDefined();
  });

  it('rejects dispute when deductions are verified accurate', () => {
    const dispute = {
      id: 'disp-2',
      bookingReference: 'NL-PN-7K3Q9M',
      vehicleId: 'veh-creta-pn',
      customerName: 'Aditya K',
      customerPhone: '+91 98765 43210',
      reason: 'FUEL_READING_INCORRECT' as const,
      claimedRefundPaise: 50000,
      customerNotes: 'I returned fuel at 90% not 80%',
      status: 'OPEN' as const,
      createdAt: new Date(),
    };

    const resolved = resolveDepositDispute(
      dispute,
      'REJECT',
      0,
      'Return inspection photo timestamp confirms 80% gauge',
    );

    expect(resolved.status).toBe('REJECTED');
    expect(resolved.approvedRefundPaise).toBe(0);
  });
});
