import type {
  City,
  Location,
  VehicleCard,
  AdminVehicle,
  CreateVehicle,
  UpdateVehicle,
  VehicleOperationalStatus,
  AddVehicleDocument,
  VehicleDocument,
  PriceAdjustmentRule,
  CreatePriceAdjustment,
  CouponRuleContract,
  ValidateCouponRequest,
  CouponValidationResult,
  VehicleReviewsSummary,
  ReviewContract,
  DisputeRecord,
} from '@newlink/contracts';
import type {
  RatePlan,
  VehicleBlock,
  TaxRule,
  BookingStatus,
  PaymentStatus,
  HandoverChecklist,
  ReturnInspection,
  DepositSettlement,
  CustomerReview,
  DepositDispute,
} from '@newlink/domain';

export interface BookingRecord {
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
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  holdExpiresAt: Date | null;
  amountPayablePaise: number;
  ratePlanId: string;
  idempotencyKey: string;
  pickupPasscode: string;
  paymentId?: string;
  orderId?: string;
  handover?: HandoverChecklist;
  returnInspection?: ReturnInspection;
  depositSettlement?: DepositSettlement;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservationRequest {
  vehicleId: string;
  start: Date;
  end: Date;
  bufferMinutes: number;
  holdDurationMinutes: number;
  customerId: string;
  customerPhone: string;
  customerName: string;
  pickupLocationId: string;
  returnLocationId: string;
  amountPayablePaise: number;
  ratePlanId: string;
  idempotencyKey: string;
  brandPrefix: string;
  cityCode: string;
}

export interface CustomerRecord {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  kycStatus: 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

export interface KycRecord {
  id: string;
  customerId: string;
  type: 'DRIVING_LICENSE' | 'AADHAAR_CARD' | 'PASSPORT';
  documentNumber: string;
  frontImageUrl: string;
  backImageUrl?: string;
  expiryDate?: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  submittedAt: Date;
}

export interface IFleetRepository {
  getCities(): Promise<City[]>;
  getCityById(id: string): Promise<City | null>;
  getCityBySlug(slug: string): Promise<City | null>;
  createCity(city: Omit<City, 'id'>): Promise<City>;
  updateCity(id: string, updates: Partial<City>): Promise<City>;
  getLocations(cityId?: string): Promise<Location[]>;
  getLocationById(id: string): Promise<Location | null>;
  createLocation(loc: Omit<Location, 'id'>): Promise<Location>;
  updateLocation(id: string, updates: Partial<Location>): Promise<Location>;
  getVehicles(cityId?: string, locationId?: string): Promise<VehicleCard[]>;
  getVehicleById(id: string): Promise<VehicleCard | null>;
  getAdminVehicles(cityId?: string, locationId?: string): Promise<AdminVehicle[]>;
  getAdminVehicleById(id: string): Promise<AdminVehicle | null>;
  createVehicle(vehicle: CreateVehicle): Promise<AdminVehicle>;
  updateVehicle(id: string, updates: UpdateVehicle): Promise<AdminVehicle>;
  updateVehicleStatus(id: string, status: VehicleOperationalStatus, reason?: string): Promise<AdminVehicle>;
  addVehicleDocument(vehicleId: string, doc: AddVehicleDocument): Promise<VehicleDocument>;
  getRatePlan(vehicleId: string): Promise<RatePlan | null>;
  getTaxRule(): Promise<TaxRule>;
  getVehicleBlocks(vehicleId: string): Promise<VehicleBlock[]>;
  getPriceAdjustments(): Promise<PriceAdjustmentRule[]>;
  createPriceAdjustment(adj: CreatePriceAdjustment): Promise<PriceAdjustmentRule>;
  togglePriceAdjustment(id: string): Promise<PriceAdjustmentRule>;
  getCoupons(): Promise<CouponRuleContract[]>;
  createCoupon(coupon: Omit<CouponRuleContract, 'id' | 'usedCount'>): Promise<CouponRuleContract>;
  validateCoupon(req: ValidateCouponRequest): Promise<CouponValidationResult>;
  getVehicleReviews(vehicleId: string): Promise<VehicleReviewsSummary>;
  addVehicleReview(review: Omit<CustomerReview, 'id' | 'createdAt'>): Promise<CustomerReview>;
  getDisputes(): Promise<DepositDispute[]>;
  createDispute(dispute: Omit<DepositDispute, 'id' | 'createdAt' | 'status'>): Promise<DepositDispute>;
  resolveDispute(
    id: string,
    action: 'APPROVE' | 'REJECT',
    approvedRefundPaise: number,
    resolutionNotes: string,
  ): Promise<DepositDispute>;
}

export interface ICustomerRepository {
  findByPhone(phone: string): Promise<CustomerRecord | null>;
  findById(id: string): Promise<CustomerRecord | null>;
  create(phone: string, name?: string): Promise<CustomerRecord>;
  update(id: string, updates: Partial<CustomerRecord>): Promise<CustomerRecord>;
  addKycDocument(doc: Omit<KycRecord, 'id' | 'submittedAt'>): Promise<KycRecord>;
  getKycDocuments(customerId: string): Promise<KycRecord[]>;
}

export interface IBookingRepository {
  /**
   * Authoritative reservation method. Guarantees:
   * 1. No double-booking even under concurrent attempts.
   * 2. Atomic creation of VehicleBlock (HOLD) + Booking record.
   * 3. Idempotent by idempotencyKey.
   */
  reserveIfAvailable(req: ReservationRequest): Promise<BookingRecord>;
  getBookingByReference(reference: string): Promise<BookingRecord | null>;
  getBookingById(id: string): Promise<BookingRecord | null>;
  getAllBookings(): Promise<BookingRecord[]>;
  updateBookingStatus(id: string, status: BookingStatus): Promise<BookingRecord>;
  confirmBookingPayment(reference: string, paymentId: string, orderId: string): Promise<BookingRecord>;
  startTripHandover(reference: string, handover: HandoverChecklist): Promise<BookingRecord>;
  completeTripReturn(
    reference: string,
    inspection: ReturnInspection,
    originalDepositPaise: number,
  ): Promise<{ booking: BookingRecord; settlement: DepositSettlement }>;
}
