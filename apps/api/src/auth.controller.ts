import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  RequestOtpSchema,
  VerifyOtpSchema,
  StaffLoginSchema,
  KycDocumentUploadSchema,
  EmailRegisterSchema,
  EmailLoginSchema,
  GoogleLoginSchema,
  type CustomerProfile,
} from '@newlink/contracts';
import {
  createOtpChallenge,
  verifyOtpChallenge,
  generate6DigitOtp,
  type StaffRole,
} from '@newlink/domain';
import { MemoryCustomerRepository } from './repositories/memory.repository.js';
import { NeonService } from './neon.service.js';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = scryptSync(password, salt, 64);
    return timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

import { SecurityService } from './security.service.js';
import type { Request } from 'express';
import { Req } from '@nestjs/common';

function mapCustomerProfile(user: any): CustomerProfile {
  let paymentMethods = { upi: [], cards: [], bankAccount: null };
  if (user?.payment_methods) {
    if (typeof user.payment_methods === 'string') {
      try {
        paymentMethods = JSON.parse(user.payment_methods);
      } catch {}
    } else {
      paymentMethods = user.payment_methods;
    }
  }

  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? null,
    phone: user.phone ?? null,
    avatarUrl: user.avatar_url ?? null,
    kycStatus: (user.kyc_status as CustomerProfile['kycStatus']) || 'NOT_SUBMITTED',
    dob: user.dob ?? null,
    address: user.address ?? null,
    city: user.city ?? null,
    state: user.state ?? null,
    pincode: user.pincode ?? null,
    emergencyContactName: user.emergency_contact_name ?? null,
    emergencyContactPhone: user.emergency_contact_phone ?? null,
    emergencyContactRelation: user.emergency_contact_relation ?? null,
    dlNumber: user.dl_number ?? null,
    dlExpiry: user.dl_expiry ?? null,
    digilockerVerified: Boolean(user.digilocker_verified),
    paymentMethods,
    createdAt: user.created_at || new Date().toISOString(),
  };
}

// In-memory challenge store (in production, Redis)
const otpChallenges: Map<string, ReturnType<typeof createOtpChallenge>> = new Map();

@Controller('api/v1')
export class AuthController {
  constructor(
    @Inject(MemoryCustomerRepository) private customerRepo: MemoryCustomerRepository,
    @Inject(NeonService) private neonService: NeonService,
    @Inject(SecurityService) private securityService: SecurityService,
  ) {}

  @Post('auth/register')
  async registerWithEmail(@Body() body: unknown, @Req() req: Request) {
    const parse = EmailRegisterSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        {
          error: {
            code: 'VALIDATION_FAILED',
            message: parse.error.issues[0]?.message || 'Invalid registration form',
            details: parse.error.issues,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { name, email, password, phone } = parse.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit registration by IP (max 15 attempts per hour)
    const ip = req.ip || req.headers['x-forwarded-for'] || 'client';
    const regLimit = this.securityService.checkRateLimit(`reg:${ip}`, 15, 3600, 3600);
    if (!regLimit.allowed) {
      throw new HttpException(
        {
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many registration attempts from this address. Please try again later.',
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Check if customer already exists in Neon
    const existing = await this.neonService.findCustomerByEmail(normalizedEmail);
    if (existing) {
      throw new HttpException(
        {
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'An account with this email address already exists. Please sign in.',
          },
        },
        HttpStatus.CONFLICT,
      );
    }

    const customerId = `cust-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const passwordHash = hashPassword(password);

    await this.neonService.insertCustomer({
      id: customerId,
      email: normalizedEmail,
      name,
      phone: phone || null,
      passwordHash,
      kycStatus: 'NOT_SUBMITTED',
    });

    const neonUser = await this.neonService.findCustomerByEmail(normalizedEmail);
    const customer: CustomerProfile = neonUser
      ? mapCustomerProfile(neonUser)
      : {
          id: customerId,
          name,
          email: normalizedEmail,
          phone: phone || null,
          kycStatus: 'NOT_SUBMITTED',
          createdAt: new Date().toISOString(),
        };

    const token = this.securityService.signJwt({
      sub: customerId,
      email: normalizedEmail,
      name,
    });

    return {
      data: {
        token,
        customer,
        message: 'Account created successfully',
      },
    };
  }

  @Post('auth/login')
  async loginWithEmail(@Body() body: unknown) {
    const parse = EmailLoginSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        {
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid email or password format',
            details: parse.error.issues,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { email, password } = parse.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Anti-brute-force rate limiting (max 5 failed attempts per 5 minutes, 15-minute lockout)
    const rateLimitKey = `login:${normalizedEmail}`;
    const rateCheck = this.securityService.checkRateLimit(rateLimitKey, 5, 300, 900);
    if (!rateCheck.allowed) {
      throw new HttpException(
        {
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: `Account temporarily locked due to multiple failed login attempts. Please retry in ${Math.ceil(rateCheck.retryAfterSeconds / 60)} minutes.`,
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user = await this.neonService.findCustomerByEmail(normalizedEmail);
    if (!user || !user.password_hash) {
      this.securityService.recordFailure(rateLimitKey);
      throw new HttpException(
        {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Incorrect email or password. Please check your credentials.',
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = verifyPassword(password, user.password_hash);
    if (!isMatch) {
      this.securityService.recordFailure(rateLimitKey);
      throw new HttpException(
        {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Incorrect email or password. Please check your credentials.',
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Reset rate limit counter upon successful authentication
    this.securityService.resetRateLimit(rateLimitKey);

    const customer = mapCustomerProfile(user);

    const token = this.securityService.signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      data: {
        token,
        customer,
        message: 'Logged in successfully',
      },
    };
  }

  @Post('auth/google')
  async loginWithGoogle(@Body() body: unknown) {
    const parse = GoogleLoginSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        {
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid Google authentication payload',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let { email, name, googleId, avatarUrl } = parse.data;
    const { credential } = parse.data;

    // If Google JWT credential token was passed from Google Identity Services
    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts[1]) {
          const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
          const payload = JSON.parse(payloadJson);
          if (payload.email) email = payload.email;
          if (payload.name) name = payload.name;
          if (payload.sub) googleId = payload.sub;
          if (payload.picture) avatarUrl = payload.picture;
        }
      } catch {
        // Fallback to direct fields
      }
    }

    if (!email) {
      throw new HttpException(
        { error: { code: 'INVALID_PAYLOAD', message: 'Email could not be verified from Google Sign-In' } },
        HttpStatus.BAD_REQUEST,
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await this.neonService.findCustomerByEmail(normalizedEmail);

    if (!user) {
      const customerId = `cust-g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      await this.neonService.insertCustomer({
        id: customerId,
        email: normalizedEmail,
        name: name || 'Google User',
        googleId: googleId || null,
        avatarUrl: avatarUrl || null,
        kycStatus: 'NOT_SUBMITTED',
      });
      user = await this.neonService.findCustomerByEmail(normalizedEmail);
    } else if (googleId && !user.google_id) {
      await this.neonService.insertCustomer({
        id: user.id,
        googleId,
        avatarUrl: avatarUrl || user.avatar_url,
        kycStatus: user.kyc_status,
      });
    }

    const customer: CustomerProfile = user
      ? mapCustomerProfile(user)
      : {
          id: `cust-${Date.now().toString(36)}`,
          name: name || 'User',
          email: normalizedEmail,
          phone: null,
          avatarUrl: avatarUrl || null,
          kycStatus: 'NOT_SUBMITTED',
          createdAt: new Date().toISOString(),
        };

    const token = this.securityService.signJwt({
      sub: customer.id,
      email: customer.email,
      name: customer.name,
    });

    return {
      data: {
        token,
        customer,
        message: 'Signed in with Google successfully',
      },
    };
  }

  @Post('auth/otp/request')
  async requestOtp(@Body() body: unknown) {
    const parse = RequestOtpSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid phone number format' } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { phone } = parse.data;

    // For local demo/testing, generate fixed code or standard OTP
    const code = phone.endsWith('1234') ? '123456' : generate6DigitOtp();
    const challenge = createOtpChallenge(phone, code, 300);
    otpChallenges.set(phone, challenge);

    // In production, dispatched via DLT SMS provider. For local DX, we return demoCode in headers or debug log.
    return {
      data: {
        success: true,
        message: 'OTP sent to mobile number',
        expiresInSeconds: 300,
        // Demo helper: if testing locally with 1234 or standard phone
        demoCode: code,
      },
    };
  }

  @Post('auth/otp/verify')
  async verifyOtp(@Body() body: unknown) {
    const parse = VerifyOtpSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid OTP payload' } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { phone, code } = parse.data;

    const challenge = otpChallenges.get(phone);
    if (!challenge) {
      throw new HttpException(
        {
          error: {
            code: 'OTP_EXPIRED',
            message: 'No active OTP found. Please request a new code.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const check = verifyOtpChallenge(challenge, code);
    if (!check.success) {
      throw new HttpException(
        { error: { code: 'INVALID_OTP', message: check.error ?? 'Invalid verification code' } },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Challenge consumed
    otpChallenges.delete(phone);

    // Find or create customer account
    let customer = await this.customerRepo.findByPhone(phone);
    if (!customer) {
      customer = await this.customerRepo.create(phone);
    }

    const profile: CustomerProfile = {
      id: customer.id,
      phone: customer.phone,
      name: customer.name,
      email: customer.email,
      kycStatus: customer.kycStatus,
      createdAt: customer.createdAt.toISOString(),
    };

    return {
      data: {
        accessToken: `jwt-access-${customer.id}-${Date.now()}`,
        refreshToken: `jwt-refresh-${customer.id}-${Date.now()}`,
        expiresInSeconds: 86400,
        customer: profile,
      },
    };
  }

  @Post('auth/staff/login')
  async staffLogin(@Body() body: unknown) {
    const parse = StaffLoginSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid staff login payload' } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { email } = parse.data;

    // Demonstration staff accounts with roles
    let role: StaffRole = 'SUPPORT';
    if (email.startsWith('admin@')) role = 'SUPER_ADMIN';
    else if (email.startsWith('fleet@')) role = 'FLEET_MANAGER';

    return {
      data: {
        staffId: `staff-${Date.now().toString(36)}`,
        email,
        role,
        permissions: ['vehicles:read', 'bookings:read', 'locations:read'],
        accessToken: `jwt-staff-${Date.now()}`,
      },
    };
  }

  @Get('me')
  async getProfile(
    @Headers('authorization') authHeader?: string,
    @Headers('x-customer-id') customerId?: string,
  ) {
    let id = customerId;
    let email: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const verified = this.securityService.verifyJwt(token);
      if (verified.valid && verified.payload) {
        id = verified.payload.sub;
        email = verified.payload.email || undefined;
      }
    }

    if (id) {
      const neonUser = await this.neonService.findCustomerById(id);
      if (neonUser) return { data: mapCustomerProfile(neonUser) };
    }
    if (email) {
      const neonUser = await this.neonService.findCustomerByEmail(email);
      if (neonUser) return { data: mapCustomerProfile(neonUser) };
    }

    let customer = await this.customerRepo.findById(id || 'cust-demo');
    if (!customer) {
      customer = await this.customerRepo.create('+919876543210', 'Rahul Sharma');
    }

    return {
      data: {
        id: customer.id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        kycStatus: customer.kycStatus,
        createdAt: customer.createdAt.toISOString(),
      },
    };
  }

  @Patch('me')
  async updateProfile(
    @Headers('authorization') authHeader?: string,
    @Headers('x-customer-id') customerId?: string,
    @Body() body?: any,
  ) {
    let id = customerId;
    let email: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const verified = this.securityService.verifyJwt(token);
      if (verified.valid && verified.payload) {
        id = verified.payload.sub;
        email = verified.payload.email || undefined;
      }
    }
    id = id || 'cust-demo';

    let updatedNeon = await this.neonService.updateCustomerProfile(id, body || {});
    if (!updatedNeon && email) {
      const found = await this.neonService.findCustomerByEmail(email);
      if (found) {
        updatedNeon = await this.neonService.updateCustomerProfile(found.id, body || {});
      }
    }

    if (updatedNeon) {
      return { data: mapCustomerProfile(updatedNeon) };
    }

    const updated = await this.customerRepo.update(id, {
      name: body?.name,
      email: body?.email,
    });
    return { data: updated };
  }

  @Post('me/digilocker/simulate')
  async simulateDigiLocker(
    @Headers('authorization') authHeader?: string,
    @Headers('x-customer-id') customerId?: string,
  ) {
    let id = customerId;
    let email: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const verified = this.securityService.verifyJwt(token);
      if (verified.valid && verified.payload) {
        id = verified.payload.sub;
        email = verified.payload.email || undefined;
      }
    }
    id = id || 'cust-demo';

    const updates = {
      kycStatus: 'APPROVED',
      digilockerVerified: true,
      dlNumber: 'MH-12-2021-0089421',
      dlExpiry: '2041-06-25',
      dob: '1995-08-14',
      address: 'Flat 402, Royal Palms, Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    };

    let updated = await this.neonService.updateCustomerProfile(id, updates);
    if (!updated && email) {
      const found = await this.neonService.findCustomerByEmail(email);
      if (found) {
        updated = await this.neonService.updateCustomerProfile(found.id, updates);
      }
    }

    if (!updated) {
      await this.customerRepo.update(id, { kycStatus: 'APPROVED' });
    }

    return {
      data: {
        success: true,
        message: 'Successfully pulled Aadhaar & Driving License via DigiLocker (MoRTH)',
        verifiedProfile: updated ? mapCustomerProfile(updated) : updates,
      },
    };
  }

  @Get('me/kyc')
  async getKycStatus(@Headers('x-customer-id') customerId?: string) {
    const id = customerId || 'cust-demo';
    const customer = await this.customerRepo.findById(id);
    const docs = await this.customerRepo.getKycDocuments(id);

    return {
      data: {
        status: customer?.kycStatus ?? 'NOT_SUBMITTED',
        documents: docs.map((d) => ({
          id: d.id,
          type: d.type,
          status: d.status,
          submittedAt: d.submittedAt.toISOString(),
          rejectionReason: d.rejectionReason ?? null,
        })),
      },
    };
  }

  @Post('me/kyc/upload')
  async uploadKyc(@Headers('x-customer-id') customerId: string, @Body() body: unknown) {
    const parse = KycDocumentUploadSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        {
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid KYC document data',
            details: parse.error.issues,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = parse.data;
    const id = customerId || 'cust-demo';

    const doc = await this.customerRepo.addKycDocument({
      customerId: id,
      type: data.type,
      documentNumber: data.documentNumber,
      frontImageUrl: data.frontImageUrl,
      backImageUrl: data.backImageUrl,
      expiryDate: data.expiryDate,
      status: 'PENDING_REVIEW',
    });

    return {
      data: {
        success: true,
        documentId: doc.id,
        status: doc.status,
        message: 'Document uploaded successfully. Under review by Newlink operations team.',
      },
    };
  }
}
