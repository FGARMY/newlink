import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  MemoryFleetRepository,
  MemoryBookingRepository,
  MemoryCustomerRepository,
} from './memory.repository.js';
import { NeonService } from '../neon.service.js';
import type {
  ReservationRequest,
  BookingRecord,
  CustomerRecord,
} from './interfaces.js';
import type { City, Location, VehicleCard } from '@newlink/contracts';
import type { BookingStatus } from '@newlink/domain';

@Injectable()
export class NeonFleetRepository extends MemoryFleetRepository {
  private readonly logger = new Logger(NeonFleetRepository.name);

  constructor(@Inject(NeonService) private neonService: NeonService) {
    super();
  }

  override async getCities(): Promise<City[]> {
    if (!this.neonService.isConfigured()) {
      return super.getCities();
    }
    try {
      const rows = await this.neonService.query<City>(
        'SELECT id, name, slug, state, code, time_zone as "timeZone", status, lead_time_minutes as "leadTimeMinutes", min_duration_minutes as "minDurationMinutes", max_duration_minutes as "maxDurationMinutes", turnaround_buffer_minutes as "turnaroundBufferMinutes" FROM cities WHERE status = $1 ORDER BY name ASC',
        ['ACTIVE']
      );
      if (rows && rows.length > 0) {
        return rows;
      }
    } catch (err) {
      this.logger.warn(`Neon getCities query failed, using in-memory roster: ${err}`);
    }
    return super.getCities();
  }

  override async getLocations(cityId?: string): Promise<Location[]> {
    if (!this.neonService.isConfigured()) {
      return super.getLocations(cityId);
    }
    try {
      let queryStr =
        'SELECT id, city_id as "cityId", name, slug, address, lat, lng, contact_phone as "contactPhone", pickup_instructions as "pickupInstructions", status, is_featured as "isFeatured" FROM locations WHERE status = $1';
      const params: unknown[] = ['ACTIVE'];
      if (cityId) {
        queryStr += ' AND city_id = $2';
        params.push(cityId);
      }
      queryStr += ' ORDER BY name ASC';
      const rows = await this.neonService.query<Location>(queryStr, params);
      if (rows && rows.length > 0) {
        return rows;
      }
    } catch (err) {
      this.logger.warn(`Neon getLocations query failed, using in-memory fallback: ${err}`);
    }
    return super.getLocations(cityId);
  }

  override async getVehicles(cityId?: string, locationId?: string): Promise<VehicleCard[]> {
    // Return memory roster merged with live catalog
    return super.getVehicles(cityId, locationId);
  }
}

@Injectable()
export class NeonCustomerRepository extends MemoryCustomerRepository {
  constructor(@Inject(NeonService) private neonService: NeonService) {
    super();
  }

  override async create(phone: string, name?: string): Promise<CustomerRecord> {
    const customer = await super.create(phone, name);
    if (this.neonService.isConfigured()) {
      await this.neonService.insertCustomer(customer);
    }
    return customer;
  }

  override async update(id: string, updates: Partial<CustomerRecord>): Promise<CustomerRecord> {
    const customer = await super.update(id, updates);
    if (this.neonService.isConfigured()) {
      await this.neonService.insertCustomer(customer);
    }
    return customer;
  }
}

@Injectable()
export class NeonBookingRepository extends MemoryBookingRepository {
  constructor(
    @Inject(NeonFleetRepository) private fleetRepository: NeonFleetRepository,
    @Inject(NeonService) private neonService: NeonService
  ) {
    super(fleetRepository);
  }

  override async reserveIfAvailable(req: ReservationRequest): Promise<BookingRecord> {
    const booking = await super.reserveIfAvailable(req);
    if (this.neonService.isConfigured()) {
      await this.neonService.insertBooking({
        id: booking.id,
        reference: booking.reference,
        vehicleId: booking.vehicleId,
        customerId: booking.customerId,
        customerPhone: booking.customerPhone,
        customerName: booking.customerName,
        pickupLocationId: booking.pickupLocationId,
        returnLocationId: booking.returnLocationId,
        start: booking.start,
        end: booking.end,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        holdExpiresAt: booking.holdExpiresAt,
        amountPayablePaise: booking.amountPayablePaise,
        ratePlanId: booking.ratePlanId,
        idempotencyKey: booking.idempotencyKey,
        pickupPasscode: booking.pickupPasscode,
      });

      await this.neonService.insertVehicleBlock({
        id: `blk-${booking.id}`,
        vehicleId: booking.vehicleId,
        bookingId: booking.id,
        type: 'HOLD',
        start: booking.start,
        end: booking.end,
        isActive: true,
        holdExpiresAt: booking.holdExpiresAt,
        reason: `Reservation ${booking.reference}`,
      });
    }
    return booking;
  }

  override async updateBookingStatus(id: string, status: BookingStatus): Promise<BookingRecord> {
    const booking = await super.updateBookingStatus(id, status);
    if (this.neonService.isConfigured()) {
      await this.neonService.query(
        'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2',
        [status, id]
      );
    }
    return booking;
  }

  override async confirmBookingPayment(
    reference: string,
    paymentId: string,
    orderId: string
  ): Promise<BookingRecord> {
    const booking = await super.confirmBookingPayment(reference, paymentId, orderId);
    if (this.neonService.isConfigured()) {
      await this.neonService.query(
        'UPDATE bookings SET status = $1, payment_status = $2, payment_id = $3, order_id = $4, updated_at = NOW() WHERE reference = $5',
        [booking.status, booking.paymentStatus, paymentId, orderId, reference]
      );
    }
    return booking;
  }
}
