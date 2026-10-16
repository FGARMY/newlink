import { Module } from '@nestjs/common';
import { ApiController } from './api.controller.js';
import { AuthController } from './auth.controller.js';
import { AdminFleetController } from './admin-fleet.controller.js';
import { PaymentsController } from './payments.controller.js';
import {
  MemoryFleetRepository,
  MemoryBookingRepository,
  MemoryCustomerRepository,
} from './repositories/memory.repository.js';

@Module({
  imports: [],
  controllers: [ApiController, AuthController, AdminFleetController, PaymentsController],
  providers: [
    MemoryFleetRepository,
    MemoryCustomerRepository,
    {
      provide: MemoryBookingRepository,
      useFactory: (fleet: MemoryFleetRepository) => new MemoryBookingRepository(fleet),
      inject: [MemoryFleetRepository],
    },
  ],
})
export class AppModule {}
