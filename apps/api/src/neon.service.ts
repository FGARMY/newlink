import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export interface NeonHealthInfo {
  status: 'connected' | 'disabled' | 'error';
  provider: 'neon';
  branch?: string;
  version?: string;
  database?: string;
  user?: string;
  serverTime?: string;
  tables?: Record<string, number>;
  error?: string;
}

@Injectable()
export class NeonService implements OnModuleInit {
  private readonly logger = new Logger(NeonService.name);
  private sqlPooled: NeonQueryFunction<false, false> | null = null;
  private sqlDirect: NeonQueryFunction<false, false> | null = null;
  private isInitialized = false;

  private getSql(type: 'pooled' | 'direct' = 'pooled') {
    const pooledUrl = process.env.DATABASE_URL;
    const directUrl = process.env.DATABASE_URL_UNPOOLED || pooledUrl;
    if (type === 'direct') {
      if (!this.sqlDirect && directUrl) {
        this.sqlDirect = neon(directUrl);
      }
      return this.sqlDirect || this.sqlPooled;
    }
    if (!this.sqlPooled && pooledUrl) {
      this.sqlPooled = neon(pooledUrl);
    }
    return this.sqlPooled;
  }

  isConfigured(): boolean {
    return Boolean(process.env.DATABASE_URL);
  }

  async onModuleInit() {
    if (!this.isConfigured()) {
      this.logger.warn('Neon DATABASE_URL is not set. Running in offline/memory mode.');
      return;
    }

    try {
      this.logger.log(`Connecting to Neon Postgres (branch: ${process.env.NEON_BRANCH || 'default'})...`);
      await this.runMigrations();
      this.isInitialized = true;
      this.logger.log('Neon Postgres schema verified and operational.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to initialize Neon Postgres: ${msg}`);
    }
  }

  private async runMigrations() {
    const sql = this.getSql('direct') || this.getSql('pooled');
    if (!sql) return;

    // DDL migrations using direct or pooled connection
    await sql.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        slug VARCHAR(128) UNIQUE NOT NULL,
        state VARCHAR(128) NOT NULL,
        code VARCHAR(16) NOT NULL,
        time_zone VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        lead_time_minutes INT NOT NULL DEFAULT 60,
        min_duration_minutes INT NOT NULL DEFAULT 480,
        max_duration_minutes INT NOT NULL DEFAULT 43200,
        turnaround_buffer_minutes INT NOT NULL DEFAULT 120,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await sql.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id VARCHAR(64) PRIMARY KEY,
        city_id VARCHAR(64) NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        contact_phone VARCHAR(32),
        pickup_instructions TEXT,
        status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
        is_featured BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await sql.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR(64) PRIMARY KEY,
        city_id VARCHAR(64) NOT NULL REFERENCES cities(id),
        location_id VARCHAR(64) NOT NULL REFERENCES locations(id),
        make VARCHAR(64) NOT NULL,
        model VARCHAR(64) NOT NULL,
        year INT NOT NULL,
        registration_number VARCHAR(64) NOT NULL,
        category VARCHAR(64) NOT NULL,
        transmission VARCHAR(32) NOT NULL,
        fuel_type VARCHAR(32) NOT NULL,
        seating_capacity INT NOT NULL,
        operational_status VARCHAR(64) NOT NULL DEFAULT 'ACTIVE',
        odometer_reading_km INT NOT NULL DEFAULT 0,
        hero_image_url TEXT NOT NULL,
        average_rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
        total_trips INT NOT NULL DEFAULT 0,
        features JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await sql.query(`
      CREATE TABLE IF NOT EXISTS rate_plans (
        vehicle_id VARCHAR(64) PRIMARY KEY REFERENCES vehicles(id) ON DELETE CASCADE,
        hourly_rate_paise BIGINT NOT NULL,
        daily_cap_paise BIGINT NOT NULL,
        weekend_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.0,
        peak_season_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.0,
        free_km_per_day INT NOT NULL DEFAULT 250,
        extra_km_charge_paise INT NOT NULL DEFAULT 1200,
        security_deposit_paise BIGINT NOT NULL DEFAULT 500000,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await sql.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(64) PRIMARY KEY,
        reference VARCHAR(64) UNIQUE NOT NULL,
        vehicle_id VARCHAR(64) NOT NULL REFERENCES vehicles(id),
        customer_id VARCHAR(64) NOT NULL,
        customer_phone VARCHAR(32) NOT NULL,
        customer_name VARCHAR(128) NOT NULL,
        pickup_location_id VARCHAR(64) NOT NULL,
        return_location_id VARCHAR(64) NOT NULL,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        status VARCHAR(32) NOT NULL,
        payment_status VARCHAR(32) NOT NULL,
        hold_expires_at TIMESTAMPTZ,
        amount_payable_paise BIGINT NOT NULL,
        rate_plan_id VARCHAR(64) NOT NULL,
        idempotency_key VARCHAR(128) UNIQUE NOT NULL,
        pickup_passcode VARCHAR(16) NOT NULL,
        payment_id VARCHAR(128),
        order_id VARCHAR(128),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await sql.query(`
      CREATE TABLE IF NOT EXISTS vehicle_blocks (
        id VARCHAR(64) PRIMARY KEY,
        vehicle_id VARCHAR(64) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        booking_id VARCHAR(64),
        block_type VARCHAR(32) NOT NULL,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        hold_expires_at TIMESTAMPTZ,
        reason TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await sql.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(64) PRIMARY KEY,
        phone VARCHAR(32),
        name VARCHAR(128),
        email VARCHAR(128),
        password_hash TEXT,
        google_id VARCHAR(128),
        avatar_url TEXT,
        kyc_status VARCHAR(32) NOT NULL DEFAULT 'NOT_SUBMITTED',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    try {
      await sql.query(`ALTER TABLE customers ALTER COLUMN phone DROP NOT NULL;`);
    } catch {
      // Column might already be nullable
    }
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT;`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS google_id VARCHAR(128);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar_url TEXT;`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS dob VARCHAR(32);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS city VARCHAR(64);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS state VARCHAR(64);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS pincode VARCHAR(16);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(128);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(32);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS emergency_contact_relation VARCHAR(64);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS dl_number VARCHAR(64);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS dl_expiry VARCHAR(32);`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS digilocker_verified BOOLEAN DEFAULT false;`);
    await sql.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '{"upi":[],"cards":[],"bankAccount":null}'::jsonb;`);
    await sql.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_email ON customers(email) WHERE email IS NOT NULL;`);

    await sql.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id VARCHAR(64) PRIMARY KEY,
        code VARCHAR(32) UNIQUE NOT NULL,
        description TEXT,
        type VARCHAR(32) NOT NULL,
        value INT NOT NULL,
        max_discount_paise BIGINT,
        min_booking_amount_paise BIGINT,
        valid_from TIMESTAMPTZ,
        valid_to TIMESTAMPTZ,
        total_usage_limit INT,
        used_count INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true
      );
    `);

    // Verify seed data for cities
    const citiesCheck = (await sql.query('SELECT COUNT(*)::int AS count FROM cities')) as Array<{ count: number }>;
    if (citiesCheck[0]?.count === 0) {
      this.logger.log('Seeding initial cities and locations into Neon Postgres...');
      await sql.query(`
        INSERT INTO cities (id, name, slug, state, code, time_zone, status) VALUES
        ('city-pune', 'Pune', 'pune', 'Maharashtra', 'PN', 'Asia/Kolkata', 'ACTIVE'),
        ('city-nashik', 'Nashik', 'nashik', 'Maharashtra', 'NS', 'Asia/Kolkata', 'ACTIVE');
      `);

      await sql.query(`
        INSERT INTO locations (id, city_id, name, slug, address, lat, lng, contact_phone, pickup_instructions, status, is_featured) VALUES
        ('loc-pn-airport', 'city-pune', 'Pune Airport (Lohegaon)', 'pune-airport', 'Near Terminal 1, Lohegaon, Pune - 411032', 18.5793, 73.9089, '+91 98765 43210', 'Parking Bay 4', 'ACTIVE', true),
        ('loc-pn-baner', 'city-pune', 'Baner - High Street Hub', 'baner-high-street', 'Balewadi High Street, Baner, Pune - 411045', 18.5701, 73.7745, '+91 98765 43211', 'Designated Newlink bays', 'ACTIVE', true),
        ('loc-ns-center', 'city-nashik', 'Nashik City Center Mall Hub', 'nashik-city-center', 'Untwadi Road, Nashik - 422002', 19.9882, 73.7663, '+91 98765 43214', 'Ground level east gate', 'ACTIVE', true);
      `);

      await sql.query(`
        INSERT INTO coupons (id, code, description, type, value, max_discount_paise, min_booking_amount_paise, is_active) VALUES
        ('coup-firstdrive', 'FIRSTDRIVE', 'Flat 15% off first booking', 'PERCENT', 1500, 150000, 300000, true),
        ('coup-punedrive', 'PUNEDRIVE', '₹500 off Pune drives', 'FIXED', 50000, 50000, 200000, true);
      `);
    }

    const vehiclesCheck = (await sql.query('SELECT COUNT(*)::int AS count FROM vehicles')) as Array<{ count: number }>;
    if (vehiclesCheck[0]?.count === 0) {
      this.logger.log('Seeding initial vehicles into Neon Postgres...');
      await sql.query(`
        INSERT INTO vehicles (id, city_id, location_id, make, model, year, registration_number, category, transmission, fuel_type, seating_capacity, operational_status, hero_image_url) VALUES
        ('veh-creta-pn', 'city-pune', 'loc-pn-airport', 'Hyundai', 'Creta', 2024, 'MH 12 RN 8821', 'SUV', 'AUTOMATIC', 'DIESEL', 5, 'ACTIVE', '/images/car-creta.jpg'),
        ('veh-carens-pn', 'city-pune', 'loc-pn-baner', 'Kia', 'Carens', 2024, 'MH 12 TC 4402', 'SUV', 'AUTOMATIC', 'DIESEL', 7, 'ACTIVE', '/images/car-carens.jpg'),
        ('veh-xuv700-pn', 'city-pune', 'loc-pn-airport', 'Mahindra', 'XUV700', 2024, 'MH 12 UX 9001', 'PREMIUM', 'AUTOMATIC', 'DIESEL', 7, 'ACTIVE', '/images/car-xuv700.jpg');
      `);
    }
  }

  async query<T = unknown>(sqlText: string, params: unknown[] = []): Promise<T[]> {
    const sql = this.getSql('pooled');
    if (!sql) {
      throw new Error('Neon database is not configured. DATABASE_URL is missing.');
    }
    return (await sql.query(sqlText, params)) as T[];
  }

  async getHealth(): Promise<NeonHealthInfo> {
    if (!this.isConfigured()) {
      return {
        status: 'disabled',
        provider: 'neon',
        error: 'DATABASE_URL not configured',
      };
    }

    try {
      const res = (await this.query(
        'SELECT version(), current_database(), current_user, NOW() as server_time;'
      )) as Array<{
        version: string;
        current_database: string;
        current_user: string;
        server_time: string;
      }>;

      const first = res[0];
      const tableCounts: Record<string, number> = {};

      try {
        const counts = (await this.query(`
          SELECT 
            (SELECT COUNT(*) FROM cities)::int as cities,
            (SELECT COUNT(*) FROM locations)::int as locations,
            (SELECT COUNT(*) FROM vehicles)::int as vehicles,
            (SELECT COUNT(*) FROM bookings)::int as bookings,
            (SELECT COUNT(*) FROM customers)::int as customers
        `)) as Array<Record<string, number>>;
        if (counts[0]) {
          Object.assign(tableCounts, counts[0]);
        }
      } catch {
        // Table count query optional if tables are fresh
      }

      return {
        status: 'connected',
        provider: 'neon',
        branch: process.env.NEON_BRANCH || 'production',
        version: first?.version,
        database: first?.current_database,
        user: first?.current_user,
        serverTime: first?.server_time,
        tables: tableCounts,
      };
    } catch (err: unknown) {
      return {
        status: 'error',
        provider: 'neon',
        branch: process.env.NEON_BRANCH || 'production',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  async insertBooking(booking: {
    id: string;
    reference: string;
    vehicleId: string;
    customerId: string;
    customerPhone: string;
    customerName: string;
    pickupLocationId: string;
    returnLocationId: string;
    start: Date;
    end: Date;
    status: string;
    paymentStatus: string;
    holdExpiresAt: Date | null;
    amountPayablePaise: number;
    ratePlanId: string;
    idempotencyKey: string;
    pickupPasscode: string;
  }) {
    if (!this.getSql('pooled')) return;
    try {
      await this.query(
        `INSERT INTO bookings (
          id, reference, vehicle_id, customer_id, customer_phone, customer_name,
          pickup_location_id, return_location_id, start_time, end_time, status,
          payment_status, hold_expires_at, amount_payable_paise, rate_plan_id,
          idempotency_key, pickup_passcode, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          payment_status = EXCLUDED.payment_status,
          updated_at = NOW()`,
        [
          booking.id,
          booking.reference,
          booking.vehicleId,
          booking.customerId,
          booking.customerPhone,
          booking.customerName,
          booking.pickupLocationId,
          booking.returnLocationId,
          booking.start.toISOString(),
          booking.end.toISOString(),
          booking.status,
          booking.paymentStatus,
          booking.holdExpiresAt?.toISOString() ?? null,
          booking.amountPayablePaise,
          booking.ratePlanId,
          booking.idempotencyKey,
          booking.pickupPasscode,
        ]
      );
    } catch (err) {
      this.logger.warn(`Failed to insert booking into Neon: ${err}`);
    }
  }

  async insertVehicleBlock(block: {
    id: string;
    vehicleId: string;
    bookingId?: string;
    type: string;
    start: Date;
    end: Date;
    isActive: boolean;
    holdExpiresAt?: Date | null;
    reason?: string;
  }) {
    if (!this.getSql('pooled')) return;
    try {
      await this.query(
        `INSERT INTO vehicle_blocks (
          id, vehicle_id, booking_id, block_type, start_time, end_time, is_active, hold_expires_at, reason, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT (id) DO UPDATE SET is_active = EXCLUDED.is_active`,
        [
          block.id,
          block.vehicleId,
          block.bookingId || null,
          block.type,
          block.start.toISOString(),
          block.end.toISOString(),
          block.isActive,
          block.holdExpiresAt?.toISOString() ?? null,
          block.reason || null,
        ]
      );
    } catch (err) {
      this.logger.warn(`Failed to insert block into Neon: ${err}`);
    }
  }

  async findCustomerByEmail(email: string) {
    if (!this.getSql('pooled')) return null;
    const rows = await this.query<{
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      password_hash: string | null;
      google_id: string | null;
      avatar_url: string | null;
      kyc_status: string;
      dob: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      pincode: string | null;
      emergency_contact_name: string | null;
      emergency_contact_phone: string | null;
      emergency_contact_relation: string | null;
      dl_number: string | null;
      dl_expiry: string | null;
      digilocker_verified: boolean | null;
      payment_methods: any;
      created_at: string;
    }>('SELECT * FROM customers WHERE email = $1 LIMIT 1', [email]);
    return rows[0] || null;
  }

  async findCustomerById(id: string) {
    if (!this.getSql('pooled')) return null;
    const rows = await this.query<{
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      password_hash: string | null;
      google_id: string | null;
      avatar_url: string | null;
      kyc_status: string;
      dob: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      pincode: string | null;
      emergency_contact_name: string | null;
      emergency_contact_phone: string | null;
      emergency_contact_relation: string | null;
      dl_number: string | null;
      dl_expiry: string | null;
      digilocker_verified: boolean | null;
      payment_methods: any;
      created_at: string;
    }>('SELECT * FROM customers WHERE id = $1 LIMIT 1', [id]);
    return rows[0] || null;
  }

  async findCustomerByGoogleId(googleId: string) {
    if (!this.getSql('pooled')) return null;
    const rows = await this.query<{
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      password_hash: string | null;
      google_id: string | null;
      avatar_url: string | null;
      kyc_status: string;
      dob: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      pincode: string | null;
      emergency_contact_name: string | null;
      emergency_contact_phone: string | null;
      emergency_contact_relation: string | null;
      dl_number: string | null;
      dl_expiry: string | null;
      digilocker_verified: boolean | null;
      payment_methods: any;
      created_at: string;
    }>('SELECT * FROM customers WHERE google_id = $1 LIMIT 1', [googleId]);
    return rows[0] || null;
  }

  async insertCustomer(customer: {
    id: string;
    phone?: string | null;
    name?: string | null;
    email?: string | null;
    passwordHash?: string | null;
    googleId?: string | null;
    avatarUrl?: string | null;
    kycStatus: string;
    dob?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: string | null;
    dlNumber?: string | null;
    dlExpiry?: string | null;
    digilockerVerified?: boolean;
    paymentMethods?: any;
  }) {
    if (!this.getSql('pooled')) return;
    try {
      await this.query(
        `INSERT INTO customers (
          id, phone, name, email, password_hash, google_id, avatar_url, kyc_status,
          dob, address, city, state, pincode,
          emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
          dl_number, dl_expiry, digilocker_verified, payment_methods,
          created_at, updated_at
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           name = COALESCE(EXCLUDED.name, customers.name),
           email = COALESCE(EXCLUDED.email, customers.email),
           phone = COALESCE(EXCLUDED.phone, customers.phone),
           password_hash = COALESCE(EXCLUDED.password_hash, customers.password_hash),
           google_id = COALESCE(EXCLUDED.google_id, customers.google_id),
           avatar_url = COALESCE(EXCLUDED.avatar_url, customers.avatar_url),
           kyc_status = EXCLUDED.kyc_status,
           dob = COALESCE(EXCLUDED.dob, customers.dob),
           address = COALESCE(EXCLUDED.address, customers.address),
           city = COALESCE(EXCLUDED.city, customers.city),
           state = COALESCE(EXCLUDED.state, customers.state),
           pincode = COALESCE(EXCLUDED.pincode, customers.pincode),
           emergency_contact_name = COALESCE(EXCLUDED.emergency_contact_name, customers.emergency_contact_name),
           emergency_contact_phone = COALESCE(EXCLUDED.emergency_contact_phone, customers.emergency_contact_phone),
           emergency_contact_relation = COALESCE(EXCLUDED.emergency_contact_relation, customers.emergency_contact_relation),
           dl_number = COALESCE(EXCLUDED.dl_number, customers.dl_number),
           dl_expiry = COALESCE(EXCLUDED.dl_expiry, customers.dl_expiry),
           digilocker_verified = COALESCE(EXCLUDED.digilocker_verified, customers.digilocker_verified),
           payment_methods = COALESCE(EXCLUDED.payment_methods, customers.payment_methods),
           updated_at = NOW()`,
        [
          customer.id,
          customer.phone || null,
          customer.name || null,
          customer.email || null,
          customer.passwordHash || null,
          customer.googleId || null,
          customer.avatarUrl || null,
          customer.kycStatus,
          customer.dob || null,
          customer.address || null,
          customer.city || null,
          customer.state || null,
          customer.pincode || null,
          customer.emergencyContactName || null,
          customer.emergencyContactPhone || null,
          customer.emergencyContactRelation || null,
          customer.dlNumber || null,
          customer.dlExpiry || null,
          customer.digilockerVerified ?? false,
          JSON.stringify(customer.paymentMethods || { upi: [], cards: [], bankAccount: null }),
        ]
      );
    } catch (err) {
      this.logger.warn(`Failed to persist customer in Neon: ${err}`);
    }
  }

  async updateCustomerProfile(id: string, updates: Record<string, any>) {
    if (!this.getSql('pooled')) return null;
    try {
      const existing = await this.findCustomerById(id);
      if (!existing) return null;

      const merged = {
        name: updates.name !== undefined ? updates.name : existing.name,
        email: updates.email !== undefined ? updates.email : existing.email,
        phone: updates.phone !== undefined ? updates.phone : existing.phone,
        avatar_url: updates.avatarUrl !== undefined ? updates.avatarUrl : existing.avatar_url,
        kyc_status: updates.kycStatus !== undefined ? updates.kycStatus : existing.kyc_status,
        dob: updates.dob !== undefined ? updates.dob : existing.dob,
        address: updates.address !== undefined ? updates.address : existing.address,
        city: updates.city !== undefined ? updates.city : existing.city,
        state: updates.state !== undefined ? updates.state : existing.state,
        pincode: updates.pincode !== undefined ? updates.pincode : existing.pincode,
        emergency_contact_name: updates.emergencyContactName !== undefined ? updates.emergencyContactName : existing.emergency_contact_name,
        emergency_contact_phone: updates.emergencyContactPhone !== undefined ? updates.emergencyContactPhone : existing.emergency_contact_phone,
        emergency_contact_relation: updates.emergencyContactRelation !== undefined ? updates.emergencyContactRelation : existing.emergency_contact_relation,
        dl_number: updates.dlNumber !== undefined ? updates.dlNumber : existing.dl_number,
        dl_expiry: updates.dlExpiry !== undefined ? updates.dlExpiry : existing.dl_expiry,
        digilocker_verified: updates.digilockerVerified !== undefined ? updates.digilockerVerified : existing.digilocker_verified,
        payment_methods: updates.paymentMethods !== undefined ? JSON.stringify(updates.paymentMethods) : (typeof existing.payment_methods === 'string' ? existing.payment_methods : JSON.stringify(existing.payment_methods || { upi: [], cards: [], bankAccount: null })),
      };

      await this.query(
        `UPDATE customers SET
           name = $1, email = $2, phone = $3, avatar_url = $4, kyc_status = $5,
           dob = $6, address = $7, city = $8, state = $9, pincode = $10,
           emergency_contact_name = $11, emergency_contact_phone = $12, emergency_contact_relation = $13,
           dl_number = $14, dl_expiry = $15, digilocker_verified = $16, payment_methods = $17::jsonb,
           updated_at = NOW()
         WHERE id = $18`,
        [
          merged.name,
          merged.email,
          merged.phone,
          merged.avatar_url,
          merged.kyc_status,
          merged.dob,
          merged.address,
          merged.city,
          merged.state,
          merged.pincode,
          merged.emergency_contact_name,
          merged.emergency_contact_phone,
          merged.emergency_contact_relation,
          merged.dl_number,
          merged.dl_expiry,
          merged.digilocker_verified,
          merged.payment_methods,
          id,
        ]
      );

      return await this.findCustomerById(id);
    } catch (err) {
      this.logger.warn(`Failed to update customer in Neon: ${err}`);
      return null;
    }
  }
}
