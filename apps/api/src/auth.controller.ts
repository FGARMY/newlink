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
  type CustomerProfile,
} from '@newlink/contracts';
import {
  createOtpChallenge,
  verifyOtpChallenge,
  generate6DigitOtp,
  hasPermission,
  type StaffRole,
} from '@newlink/domain';
import { MemoryCustomerRepository } from './repositories/memory.repository.js';

// In-memory challenge store (in production, Redis)
const otpChallenges: Map<string, ReturnType<typeof createOtpChallenge>> = new Map();

@Controller('api/v1')
export class AuthController {
  constructor(@Inject(MemoryCustomerRepository) private customerRepo: MemoryCustomerRepository) {}

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
        { error: { code: 'OTP_EXPIRED', message: 'No active OTP found. Please request a new code.' } },
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
    const { email, password } = parse.data;

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
  async getProfile(@Headers('x-customer-id') customerId?: string) {
    const id = customerId || 'cust-demo';
    let customer = await this.customerRepo.findById(id);
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
    @Headers('x-customer-id') customerId: string,
    @Body() body: { name?: string; email?: string },
  ) {
    const id = customerId || 'cust-demo';
    const updated = await this.customerRepo.update(id, {
      name: body.name,
      email: body.email,
    });
    return { data: updated };
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
  async uploadKyc(
    @Headers('x-customer-id') customerId: string,
    @Body() body: unknown,
  ) {
    const parse = KycDocumentUploadSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid KYC document data', details: parse.error.issues } },
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
