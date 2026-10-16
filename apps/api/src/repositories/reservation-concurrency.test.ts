import { describe, expect, it } from 'vitest';
import { MemoryFleetRepository, MemoryBookingRepository } from './memory.repository.js';
import type { ReservationRequest } from './interfaces.js';

describe('Concurrency Protection: Double-Booking Prevention', () => {
  it('guarantees that 100 simultaneous booking attempts for the same vehicle result in EXACTLY ONE success', async () => {
    const fleetRepo = new MemoryFleetRepository();
    const bookingRepo = new MemoryBookingRepository(fleetRepo);

    const vehicleId = 'veh-creta-pn';
    const start = new Date('2026-11-01T10:00:00Z');
    const end = new Date('2026-11-03T10:00:00Z');

    const totalConcurrentRequests = 100;
    const requests: ReservationRequest[] = Array.from({ length: totalConcurrentRequests }, (_, i) => ({
      vehicleId,
      start,
      end,
      bufferMinutes: 120, // 2-hr turnaround buffer
      holdDurationMinutes: 10,
      customerId: `cust-${i}`,
      customerPhone: `+9198000000${String(i).padStart(2, '0')}`,
      customerName: `Customer ${i}`,
      pickupLocationId: 'loc-pn-airport',
      returnLocationId: 'loc-pn-airport',
      amountPayablePaise: 913000,
      ratePlanId: 'rp-creta-pn',
      idempotencyKey: `idem-unique-${i}`,
      brandPrefix: 'NL',
      cityCode: 'PN',
    }));

    // Fire all 100 requests simultaneously via Promise.allSettled
    const results = await Promise.allSettled(
      requests.map((req) => bookingRepo.reserveIfAvailable(req)),
    );

    const successful = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    // VERIFICATION: Exactly 1 reservation succeeded, 99 failed with VEHICLE_UNAVAILABLE
    expect(successful.length).toBe(1);
    expect(rejected.length).toBe(99);

    if (successful[0] && successful[0].status === 'fulfilled') {
      const confirmedBooking = successful[0].value;
      expect(confirmedBooking.status).toBe('PAYMENT_PENDING');
      expect(confirmedBooking.reference.startsWith('NL-PN-')).toBe(true);

      // Verify that the calendar contains the active block
      const blocks = await fleetRepo.getVehicleBlocks(vehicleId);
      expect(blocks.length).toBe(1);
      expect(blocks[0]?.bookingId).toBe(confirmedBooking.id);
      expect(blocks[0]?.isActive).toBe(true);
    }
  });

  it('honors idempotency: identical idempotencyKey returns the same booking without error', async () => {
    const fleetRepo = new MemoryFleetRepository();
    const bookingRepo = new MemoryBookingRepository(fleetRepo);

    const req: ReservationRequest = {
      vehicleId: 'veh-carens-pn',
      start: new Date('2026-11-10T10:00:00Z'),
      end: new Date('2026-11-12T10:00:00Z'),
      bufferMinutes: 120,
      holdDurationMinutes: 10,
      customerId: 'cust-same',
      customerPhone: '+919876543210',
      customerName: 'Same Customer',
      pickupLocationId: 'loc-pn-baner',
      returnLocationId: 'loc-pn-baner',
      amountPayablePaise: 500000,
      ratePlanId: 'rp-carens-pn',
      idempotencyKey: 'idem-fixed-key-12345',
      brandPrefix: 'NL',
      cityCode: 'PN',
    };

    const first = await bookingRepo.reserveIfAvailable(req);
    const retry = await bookingRepo.reserveIfAvailable(req);

    expect(retry.id).toBe(first.id);
    expect(retry.reference).toBe(first.reference);
  });

  it('progresses booking through complete lifecycle: HOLD -> CONFIRMED -> ACTIVE -> COMPLETED', async () => {
    const fleetRepo = new MemoryFleetRepository();
    const bookingRepo = new MemoryBookingRepository(fleetRepo);

    // 1. Reserve vehicle (HOLD / PAYMENT_PENDING)
    const booking = await bookingRepo.reserveIfAvailable({
      vehicleId: 'veh-creta-pn',
      start: new Date('2026-12-01T10:00:00Z'),
      end: new Date('2026-12-03T10:00:00Z'),
      bufferMinutes: 120,
      holdDurationMinutes: 10,
      customerId: 'cust-demo',
      customerPhone: '+919876543210',
      customerName: 'Aarav Sharma',
      pickupLocationId: 'loc-pn-airport',
      returnLocationId: 'loc-pn-airport',
      amountPayablePaise: 450000,
      ratePlanId: 'rp-creta-pn',
      idempotencyKey: 'idem-lifecycle-test',
      brandPrefix: 'NL',
      cityCode: 'PN',
    });

    expect(booking.status).toBe('PAYMENT_PENDING');
    expect(booking.paymentStatus).toBe('UNPAID');

    // 2. Confirm Payment
    const confirmed = await bookingRepo.confirmBookingPayment(
      booking.reference,
      'pay_mock_123456',
      'order_mock_987654',
    );
    expect(confirmed.status).toBe('CONFIRMED');
    expect(confirmed.paymentStatus).toBe('PAID');
    expect(confirmed.paymentId).toBe('pay_mock_123456');

    // 3. Start Trip Handover (Pickup inspection)
    const active = await bookingRepo.startTripHandover(booking.reference, {
      odometerKm: 14200,
      fuelLevelPercent: 100,
      hasFastag: true,
      exteriorClean: true,
      interiorClean: true,
      spareWheelPresent: true,
      verifiedByPasscode: true,
      handedOverAt: new Date(),
    });
    expect(active.status).toBe('ACTIVE');
    expect(active.handover?.odometerKm).toBe(14200);

    // 4. Complete Trip Return (Return inspection + deposit settlement)
    const { booking: completed, settlement } = await bookingRepo.completeTripReturn(
      booking.reference,
      {
        returnOdometerKm: 14550, // 350 km
        returnFuelLevelPercent: 95, // 5% shortage -> 5 * 2500 = ₹125 (12500 paise)
        fastagTollPaise: 25000, // ₹250 Fastag
        returnedAt: new Date(),
      },
      500000, // ₹5,000 security deposit
    );

    expect(completed.status).toBe('COMPLETED');
    expect(settlement.originalDepositPaise).toBe(500000);
    // Toll 25000 + Fuel 12500 = 37500 paise deductions
    expect(settlement.totalDeductionsPaise).toBe(37500);
    expect(settlement.refundAmountPaise).toBe(462500); // ₹4,625 refunded
  });
});

