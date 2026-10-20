import { z } from 'zod';

/* ------------------------------------------------------------------------------------------ */
/* Standard Response Envelopes & Error Structures                                             */
/* ------------------------------------------------------------------------------------------ */

export const ApiErrorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
});

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.array(ApiErrorDetailSchema).optional(),
  requestId: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export function apiSuccessEnvelope<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    meta: z
      .object({
        requestId: z.string().optional(),
        nextCursor: z.string().nullable().optional(),
        total: z.number().optional(),
      })
      .optional(),
  });
}

/* ------------------------------------------------------------------------------------------ */
/* City & Location Schemas                                                                    */
/* ------------------------------------------------------------------------------------------ */

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  state: z.string(),
  code: z.string(),
  timeZone: z.string().default('Asia/Kolkata'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  leadTimeMinutes: z.number().default(60),
  minDurationMinutes: z.number().default(480), // 8 hours
  maxDurationMinutes: z.number().default(43200), // 30 days
  turnaroundBufferMinutes: z.number().default(120), // 2 hours
});
export type City = z.infer<typeof CitySchema>;

export const CreateCitySchema = CitySchema.omit({ id: true });
export type CreateCity = z.infer<typeof CreateCitySchema>;

export const UpdateCitySchema = CreateCitySchema.partial();
export type UpdateCity = z.infer<typeof UpdateCitySchema>;

export const LocationHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  opensAt: z.number().min(0).max(1440),
  closesAt: z.number().min(0).max(1440),
});

export const LocationSchema = z.object({
  id: z.string(),
  cityId: z.string(),
  name: z.string(),
  slug: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  contactPhone: z.string(),
  pickupInstructions: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  isFeatured: z.boolean().default(false),
  hours: z.array(LocationHoursSchema).default([]),
});
export type Location = z.infer<typeof LocationSchema>;

export const CreateLocationSchema = LocationSchema.omit({ id: true });
export type CreateLocation = z.infer<typeof CreateLocationSchema>;

export const UpdateLocationSchema = CreateLocationSchema.partial();
export type UpdateLocation = z.infer<typeof UpdateLocationSchema>;

/* ------------------------------------------------------------------------------------------ */
/* Vehicle & Catalog Schemas                                                                  */
/* ------------------------------------------------------------------------------------------ */

export const VehicleCategorySchema = z.enum([
  'HATCHBACK',
  'SEDAN',
  'COMPACT_SUV',
  'SUV',
  'PREMIUM',
  'LUXURY',
  'ELECTRIC',
]);
export type VehicleCategory = z.infer<typeof VehicleCategorySchema>;

export const FuelTypeSchema = z.enum(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC']);
export type FuelType = z.infer<typeof FuelTypeSchema>;

export const TransmissionSchema = z.enum(['MANUAL', 'AUTOMATIC']);
export type Transmission = z.infer<typeof TransmissionSchema>;

export const VehicleMediaSchema = z.object({
  id: z.string(),
  storageKey: z.string(),
  url: z.string(),
  sortOrder: z.number(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  blurDataUrl: z.string().optional(),
});
export type VehicleMedia = z.infer<typeof VehicleMediaSchema>;

export const VehicleCardSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  variant: z.string().optional(),
  category: VehicleCategorySchema,
  transmission: TransmissionSchema,
  fuel: FuelTypeSchema,
  seats: z.number(),
  cityId: z.string(),
  cityName: z.string(),
  locationId: z.string(),
  locationName: z.string(),
  registrationYear: z.number(),
  ratingAvg: z.number(),
  ratingCount: z.number(),
  startingPricePaise: z.number(), // Hourly or daily base
  dailyRatePaise: z.number(),
  securityDepositPaise: z.number(),
  primaryImageUrl: z.string(),
  features: z.array(z.string()).default([]),
  isAvailable: z.boolean().default(true),
});
export type VehicleCard = z.infer<typeof VehicleCardSchema>;

/* ------------------------------------------------------------------------------------------ */
/* Search & Availability Schemas                                                              */
/* ------------------------------------------------------------------------------------------ */

export const SearchVehiclesQuerySchema = z.object({
  city: z.string(),
  location: z.string().optional(),
  start: z.string(), // ISO-8601 or YYYY-MM-DDTHH:mm
  end: z.string(), // ISO-8601 or YYYY-MM-DDTHH:mm
  category: z.string().optional(),
  transmission: TransmissionSchema.optional(),
  fuel: FuelTypeSchema.optional(),
  seats: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  brand: z.string().optional(),
  sort: z
    .enum(['RECOMMENDED', 'PRICE_ASC', 'PRICE_DESC', 'RATING', 'POPULARITY'])
    .default('RECOMMENDED'),
});
export type SearchVehiclesQuery = z.infer<typeof SearchVehiclesQuerySchema>;

/* ------------------------------------------------------------------------------------------ */
/* Price Quote & Booking Schemas                                                              */
/* ------------------------------------------------------------------------------------------ */

export const QuoteRequestSchema = z.object({
  vehicleId: z.string(),
  pickupLocationId: z.string(),
  returnLocationId: z.string().optional(),
  start: z.string(),
  end: z.string(),
  couponCode: z.string().optional(),
});
export type QuoteRequest = z.infer<typeof QuoteRequestSchema>;

export const PricingLineItemSchema = z.object({
  kind: z.enum(['RENTAL', 'DISCOUNT', 'TAX', 'FEE', 'DEPOSIT']),
  label: z.string(),
  amountPaise: z.number(),
});

export const QuoteResponseSchema = z.object({
  quoteId: z.string(),
  vehicleId: z.string(),
  rentalDurationMinutes: z.number(),
  billableHours: z.number(),
  baseRentalPaise: z.number(),
  discountPaise: z.number(),
  taxableValuePaise: z.number(),
  taxPaise: z.number(),
  rentalTotalPaise: z.number(),
  securityDepositPaise: z.number(),
  payableNowPaise: z.number(),
  lineItems: z.array(PricingLineItemSchema),
  couponCodeApplied: z.string().nullable().optional(),
  expiresAt: z.string(), // ISO-8601
});
export type QuoteResponse = z.infer<typeof QuoteResponseSchema>;

export const CreateHoldRequestSchema = z.object({
  quoteId: z.string(),
  customerId: z.string().optional(),
  customerPhone: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email().optional(),
  idempotencyKey: z.string(),
});
export type CreateHoldRequest = z.infer<typeof CreateHoldRequestSchema>;

export const BookingConfirmationSchema = z.object({
  bookingReference: z.string(),
  status: z.string(),
  holdExpiresAt: z.string().optional(),
  amountPayablePaise: z.number(),
  pickupLocationName: z.string(),
  start: z.string(),
  end: z.string(),
});
export type BookingConfirmation = z.infer<typeof BookingConfirmationSchema>;

/* ------------------------------------------------------------------------------------------ */
/* Customer Authentication & KYC Schemas                                                      */
/* ------------------------------------------------------------------------------------------ */

export const RequestOtpSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid mobile phone number format'),
});
export type RequestOtp = z.infer<typeof RequestOtpSchema>;

export const VerifyOtpSchema = z.object({
  phone: z.string(),
  code: z.string().length(6, 'OTP must be 6 digits'),
});
export type VerifyOtp = z.infer<typeof VerifyOtpSchema>;

export const CustomerProfileSchema = z.object({
  id: z.string(),
  phone: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  kycStatus: z.enum(['NOT_SUBMITTED', 'PENDING_REVIEW', 'APPROVED', 'REJECTED']),
  createdAt: z.string(),
});
export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;

export const AuthTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresInSeconds: z.number(),
  customer: CustomerProfileSchema,
});
export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;

export const StaffLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totpCode: z.string().length(6).optional(),
});
export type StaffLogin = z.infer<typeof StaffLoginSchema>;

export const KycDocumentUploadSchema = z.object({
  type: z.enum(['DRIVING_LICENSE', 'AADHAAR_CARD', 'PASSPORT']),
  documentNumber: z.string().min(4),
  frontImageUrl: z.string().url(),
  backImageUrl: z.string().url().optional(),
  expiryDate: z.string().optional(), // YYYY-MM-DD
});
export type KycDocumentUpload = z.infer<typeof KycDocumentUploadSchema>;

export const KycStatusResponseSchema = z.object({
  status: z.enum(['NOT_SUBMITTED', 'PENDING_REVIEW', 'APPROVED', 'REJECTED']),
  documents: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      status: z.string(),
      submittedAt: z.string(),
      rejectionReason: z.string().nullable().optional(),
    }),
  ),
});
export type KycStatusResponse = z.infer<typeof KycStatusResponseSchema>;

/* ------------------------------------------------------------------------------------------ */
/* Fleet Management & Compliance Schemas                                                      */
/* ------------------------------------------------------------------------------------------ */

export const VehicleDocumentTypeSchema = z.enum([
  'REGISTRATION_CERTIFICATE',
  'COMMERCIAL_INSURANCE',
  'POLLUTION_UNDER_CONTROL',
  'FITNESS_CERTIFICATE',
  'ALL_INDIA_PERMIT',
]);
export type VehicleDocumentType = z.infer<typeof VehicleDocumentTypeSchema>;

export const VehicleDocumentSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  type: VehicleDocumentTypeSchema,
  documentNumber: z.string(),
  documentUrl: z.string().optional(),
  issuedOn: z.string().optional(),
  expiresOn: z.string(),
  verified: z.boolean().default(true),
});
export type VehicleDocument = z.infer<typeof VehicleDocumentSchema>;

export const VehicleOperationalStatusSchema = z.enum(['IN_SERVICE', 'MAINTENANCE', 'INACTIVE']);
export type VehicleOperationalStatus = z.infer<typeof VehicleOperationalStatusSchema>;

export const AdminVehicleSchema = VehicleCardSchema.extend({
  vin: z.string().optional(),
  registrationNumber: z.string(),
  odometerKm: z.number().default(0),
  fuelLevelPercent: z.number().default(100),
  operationalStatus: VehicleOperationalStatusSchema.default('IN_SERVICE'),
  documents: z.array(VehicleDocumentSchema).default([]),
  lastServicedAt: z.string().optional(),
});
export type AdminVehicle = z.infer<typeof AdminVehicleSchema>;

export const CreateVehicleSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  variant: z.string().optional(),
  category: VehicleCategorySchema,
  transmission: TransmissionSchema,
  fuel: FuelTypeSchema,
  seats: z.coerce.number().min(2).max(12),
  cityId: z.string().min(1, 'City is required'),
  locationId: z.string().min(1, 'Location is required'),
  registrationNumber: z.string().min(4, 'Registration number is required'),
  registrationYear: z.coerce.number().min(2015).max(2027),
  odometerKm: z.coerce.number().min(0).default(5000),
  dailyRatePaise: z.coerce.number().min(10000),
  securityDepositPaise: z.coerce.number().min(0),
  primaryImageUrl: z.string().min(1),
  features: z.array(z.string()).default([]),
  operationalStatus: VehicleOperationalStatusSchema.default('IN_SERVICE'),
});
export type CreateVehicle = z.infer<typeof CreateVehicleSchema>;

export const UpdateVehicleSchema = CreateVehicleSchema.partial();
export type UpdateVehicle = z.infer<typeof UpdateVehicleSchema>;

export const UpdateVehicleStatusSchema = z.object({
  operationalStatus: VehicleOperationalStatusSchema,
  reason: z.string().optional(),
});
export type UpdateVehicleStatus = z.infer<typeof UpdateVehicleStatusSchema>;

export const AddVehicleDocumentSchema = z.object({
  type: VehicleDocumentTypeSchema,
  documentNumber: z.string().min(1),
  documentUrl: z.string().optional(),
  issuedOn: z.string().optional(),
  expiresOn: z.string(),
});
export type AddVehicleDocument = z.infer<typeof AddVehicleDocumentSchema>;

/* ------------------------------------------------------------------------------------------ */
/* Payment Gateway & Checkout Schemas                                                         */
/* ------------------------------------------------------------------------------------------ */

export const PaymentMethodSchema = z.enum(['UPI', 'CARD', 'NET_BANKING', 'WALLET']);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const CreatePaymentOrderSchema = z.object({
  bookingReference: z.string(),
  amountPaise: z.number().positive(),
});
export type CreatePaymentOrder = z.infer<typeof CreatePaymentOrderSchema>;

export const PaymentOrderSchema = z.object({
  orderId: z.string(),
  bookingReference: z.string(),
  amountPaise: z.number(),
  currency: z.literal('INR'),
  receipt: z.string(),
  status: z.enum(['CREATED', 'PAID', 'FAILED', 'EXPIRED']),
  createdAt: z.string(),
});
export type PaymentOrder = z.infer<typeof PaymentOrderSchema>;

export const VerifyPaymentSchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string().optional(),
  method: PaymentMethodSchema.default('UPI'),
  bookingReference: z.string(),
});
export type VerifyPayment = z.infer<typeof VerifyPaymentSchema>;

export const PaymentReceiptSchema = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  bookingReference: z.string(),
  amountPaise: z.number(),
  status: z.string(),
  method: PaymentMethodSchema,
  paidAt: z.string(),
});
export type PaymentReceipt = z.infer<typeof PaymentReceiptSchema>;

/* ------------------------------------------------------------------------------------------ */
/* Digital Handover & Return Inspection Schemas                                               */
/* ------------------------------------------------------------------------------------------ */

export const TripStartHandoverSchema = z.object({
  bookingReference: z.string(),
  passcode: z.string().length(4, 'Passcode must be 4 digits'),
  odometerKm: z.coerce.number().min(0),
  fuelLevelPercent: z.coerce.number().min(0).max(100),
  hasFastag: z.boolean().default(true),
  exteriorClean: z.boolean().default(true),
  interiorClean: z.boolean().default(true),
  spareWheelPresent: z.boolean().default(true),
  inspectionNotes: z.string().optional(),
});
export type TripStartHandover = z.infer<typeof TripStartHandoverSchema>;

export const TripEndInspectionSchema = z.object({
  bookingReference: z.string(),
  returnOdometerKm: z.coerce.number().min(0),
  returnFuelLevelPercent: z.coerce.number().min(0).max(100),
  fastagTollPaise: z.coerce.number().min(0).default(0),
  damageDeductionPaise: z.coerce.number().min(0).default(0),
  trafficViolationPaise: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
});
export type TripEndInspection = z.infer<typeof TripEndInspectionSchema>;

export const DepositSettlementSchema = z.object({
  originalDepositPaise: z.number(),
  totalDeductionsPaise: z.number(),
  deductionsBreakdown: z.object({
    fastagTollsPaise: z.number(),
    fuelDifferencePaise: z.number(),
    damageOrFinePaise: z.number(),
  }),
  refundAmountPaise: z.number(),
  status: z.literal('SETTLED'),
  settledAt: z.string(),
});
export type DepositSettlement = z.infer<typeof DepositSettlementSchema>;

/* ------------------------------------------------------------------------------------------ */
/* Dynamic Pricing Adjustments & Coupons Schemas                                              */
/* ------------------------------------------------------------------------------------------ */

export const PriceAdjustmentRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(['SEASON', 'HOLIDAY', 'PROMO']),
  startDate: z.string(), // YYYY-MM-DD
  endDate: z.string(), // YYYY-MM-DD
  mode: z.enum(['MULTIPLIER', 'OVERRIDE_DAILY']),
  value: z.number(), // Basis points (e.g. 11500 = 1.15x) or paise
  priority: z.number().default(1),
  cityId: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().default(true),
});
export type PriceAdjustmentRule = z.infer<typeof PriceAdjustmentRuleSchema>;

export const CreatePriceAdjustmentSchema = z.object({
  name: z.string().min(2),
  kind: z.enum(['SEASON', 'HOLIDAY', 'PROMO']),
  startDate: z.string(),
  endDate: z.string(),
  mode: z.enum(['MULTIPLIER', 'OVERRIDE_DAILY']),
  value: z.number().positive(),
  priority: z.number().default(1),
  cityId: z.string().optional(),
  categoryId: z.string().optional(),
});
export type CreatePriceAdjustment = z.infer<typeof CreatePriceAdjustmentSchema>;

export const CouponRuleContractSchema = z.object({
  id: z.string(),
  code: z.string().toUpperCase(),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.number(), // Basis points or paise
  description: z.string(),
  maxDiscountPaise: z.number().optional(),
  minBookingAmountPaise: z.number().optional(),
  validFrom: z.string(),
  validTo: z.string(),
  totalUsageLimit: z.number().optional(),
  usedCount: z.number().default(0),
  isActive: z.boolean().default(true),
});
export type CouponRuleContract = z.infer<typeof CouponRuleContractSchema>;

export const ValidateCouponRequestSchema = z.object({
  code: z.string(),
  baseRentalPaise: z.number(),
  cityId: z.string().optional(),
  categoryId: z.string().optional(),
  vehicleId: z.string().optional(),
  customerId: z.string().optional(),
});
export type ValidateCouponRequest = z.infer<typeof ValidateCouponRequestSchema>;

export const CouponValidationResultSchema = z.object({
  isValid: z.boolean(),
  code: z.string(),
  discountPaise: z.number(),
  message: z.string(),
  newTotalPaise: z.number().optional(),
});
export type CouponValidationResult = z.infer<typeof CouponValidationResultSchema>;

/* ------------------------------------------------------------------------------------------ */
/* Super Admin Operational Analytics Schemas                                                  */
/* ------------------------------------------------------------------------------------------ */

export const CityAnalyticsSchema = z.object({
  cityId: z.string(),
  cityName: z.string(),
  totalFleet: z.number(),
  activeRentals: z.number(),
  revenuePaise: z.number(),
  occupancyRatePercent: z.number(),
  revPacPaise: z.number(),
});
export type CityAnalytics = z.infer<typeof CityAnalyticsSchema>;

export const AdminAnalyticsSchema = z.object({
  totalFleet: z.number(),
  activeRentals: z.number(),
  availableVehicles: z.number(),
  maintenanceVehicles: z.number(),
  occupancyRatePercent: z.number(),
  serviceabilityPercent: z.number(),
  totalRevenuePaise: z.number(),
  depositsHeldPaise: z.number(),
  depositsRefundedPaise: z.number(),
  revPacPaise: z.number(),
  totalBookingsCount: z.number(),
  cityBreakdown: z.array(CityAnalyticsSchema),
  recentBookings: z.array(
    z.object({
      reference: z.string(),
      vehicleModel: z.string(),
      cityName: z.string(),
      customerName: z.string(),
      status: z.string(),
      amountPaise: z.number(),
    }),
  ),
});
export type AdminAnalytics = z.infer<typeof AdminAnalyticsSchema>;

/* ------------------------------------------------------------------------------------------ */
/* Customer Reviews & Ratings Schemas                                                         */
/* ------------------------------------------------------------------------------------------ */

export const CreateReviewSchema = z.object({
  bookingReference: z.string(),
  overallRating: z.coerce.number().int().min(1).max(5),
  cleanlinessRating: z.coerce.number().int().min(1).max(5),
  conditionRating: z.coerce.number().int().min(1).max(5),
  handoverRating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
});
export type CreateReview = z.infer<typeof CreateReviewSchema>;

export const ReviewContractSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  bookingReference: z.string(),
  customerName: z.string(),
  customerCity: z.string(),
  overallRating: z.number(),
  cleanlinessRating: z.number(),
  conditionRating: z.number(),
  handoverRating: z.number(),
  comment: z.string(),
  createdAt: z.string(),
});
export type ReviewContract = z.infer<typeof ReviewContractSchema>;

export const VehicleReviewsSummarySchema = z.object({
  ratingAvg: z.number(),
  ratingCount: z.number(),
  cleanlinessAvg: z.number(),
  conditionAvg: z.number(),
  handoverAvg: z.number(),
  reviews: z.array(ReviewContractSchema),
});
export type VehicleReviewsSummary = z.infer<typeof VehicleReviewsSummarySchema>;

/* ------------------------------------------------------------------------------------------ */
/* Damage & Security Deposit Dispute Schemas                                                  */
/* ------------------------------------------------------------------------------------------ */

export const DisputeReasonEnum = z.enum([
  'FASTAG_MISMATCH',
  'PRE_EXISTING_SCRATCH',
  'FUEL_READING_INCORRECT',
  'CLEANING_FEE_CONTESTED',
  'OTHER',
]);

export const CreateDisputeSchema = z.object({
  bookingReference: z.string(),
  reason: DisputeReasonEnum,
  claimedRefundPaise: z.coerce.number().int().positive('Claimed refund must be positive'),
  customerNotes: z.string().min(10, 'Please provide detailed explanation (at least 10 characters)'),
});
export type CreateDispute = z.infer<typeof CreateDisputeSchema>;

export const ResolveDisputeSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  approvedRefundPaise: z.coerce.number().int().min(0).default(0),
  resolutionNotes: z.string().min(5, 'Please provide resolution notes'),
});
export type ResolveDispute = z.infer<typeof ResolveDisputeSchema>;

export const DisputeRecordSchema = z.object({
  id: z.string(),
  bookingReference: z.string(),
  vehicleId: z.string(),
  vehicleModel: z.string(),
  customerName: z.string(),
  customerPhone: z.string().optional(),
  reason: DisputeReasonEnum,
  claimedRefundPaise: z.number(),
  customerNotes: z.string(),
  status: z.enum(['OPEN', 'UNDER_REVIEW', 'REFUND_APPROVED', 'REJECTED']),
  resolutionNotes: z.string().optional(),
  approvedRefundPaise: z.number().optional(),
  createdAt: z.string(),
  resolvedAt: z.string().optional(),
});
export type DisputeRecord = z.infer<typeof DisputeRecordSchema>;
