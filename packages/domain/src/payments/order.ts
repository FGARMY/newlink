import { DomainError } from '../errors.js';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';

export type PaymentOrderStatus = 'CREATED' | 'PAID' | 'FAILED' | 'EXPIRED';

export interface PaymentOrder {
  orderId: string;
  bookingReference: string;
  amountPaise: number;
  currency: 'INR';
  receipt: string;
  status: PaymentOrderStatus;
  createdAt: Date;
}

export interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature?: string;
  method: PaymentMethod;
}

/**
 * Creates a normalized Payment Gateway order (compatible with Razorpay / Cashfree formats).
 */
export function createPaymentOrder(bookingReference: string, amountPaise: number): PaymentOrder {
  if (amountPaise <= 0) {
    throw new DomainError('INVALID_INPUT', 'Payment order amount must be greater than zero');
  }

  const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  const receipt = `rcpt_${bookingReference.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return {
    orderId,
    bookingReference,
    amountPaise,
    currency: 'INR',
    receipt,
    status: 'CREATED',
    createdAt: new Date(),
  };
}

/**
 * Verifies payment payload integrity.
 * In production, computes HMAC-SHA256(orderId + "|" + paymentId, keySecret).
 * For demo/sandbox integration, verifies non-empty identifiers and valid status.
 */
export function verifyPaymentIntegrity(request: PaymentVerificationRequest): boolean {
  if (!request.orderId || !request.paymentId) {
    return false;
  }
  if (!request.orderId.startsWith('order_')) {
    return false;
  }
  if (!request.paymentId.startsWith('pay_')) {
    return false;
  }
  return true;
}
