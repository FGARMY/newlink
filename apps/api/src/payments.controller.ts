import { Controller, Post, Body, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreatePaymentOrderSchema, VerifyPaymentSchema } from '@newlink/contracts';
import { createPaymentOrder, verifyPaymentIntegrity } from '@newlink/domain';
import { MemoryBookingRepository } from './repositories/memory.repository.js';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(@Inject(MemoryBookingRepository) private bookingRepo: MemoryBookingRepository) {}

  @Post('order')
  async createOrder(@Body() body: unknown) {
    const parse = CreatePaymentOrderSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        {
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid payment order request',
            details: parse.error.issues,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { bookingReference, amountPaise } = parse.data;
    const booking = await this.bookingRepo.getBookingByReference(bookingReference);
    if (!booking) {
      throw new HttpException(
        { error: { code: 'NOT_FOUND', message: 'Booking reference not found' } },
        HttpStatus.NOT_FOUND,
      );
    }

    const order = createPaymentOrder(bookingReference, amountPaise);

    return {
      data: {
        orderId: order.orderId,
        bookingReference: order.bookingReference,
        amountPaise: order.amountPaise,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      },
    };
  }

  @Post('verify')
  async verifyPayment(@Body() body: unknown) {
    const parse = VerifyPaymentSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        {
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid payment verification payload',
            details: parse.error.issues,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { orderId, paymentId, method, bookingReference } = parse.data;

    const isValid = verifyPaymentIntegrity({
      orderId,
      paymentId,
      method,
    });

    if (!isValid) {
      throw new HttpException(
        { error: { code: 'PAYMENT_FAILED', message: 'Payment signature or verification failed' } },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Atomically transition booking from PAYMENT_PENDING to CONFIRMED
    const updatedBooking = await this.bookingRepo.confirmBookingPayment(
      bookingReference,
      paymentId,
      orderId,
    );

    return {
      data: {
        receipt: {
          paymentId,
          orderId,
          bookingReference,
          amountPaise: updatedBooking.amountPayablePaise,
          status: 'SUCCESS',
          method,
          paidAt: new Date().toISOString(),
        },
        booking: {
          reference: updatedBooking.reference,
          status: updatedBooking.status,
          paymentStatus: updatedBooking.paymentStatus,
          pickupPasscode: updatedBooking.pickupPasscode,
        },
      },
    };
  }
}
