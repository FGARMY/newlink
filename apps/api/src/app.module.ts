import { Module } from '@nestjs/common';
import { ApiController } from './api.controller.js';
import { AuthController } from './auth.controller.js';
import { AdminFleetController } from './admin-fleet.controller.js';
import { PaymentsController } from './payments.controller.js';
import { NeonService } from './neon.service.js';
import { SecurityService } from './security.service.js';
import {
  MemoryFleetRepository,
  MemoryBookingRepository,
  MemoryCustomerRepository,
} from './repositories/memory.repository.js';
import {
  NeonFleetRepository,
  NeonBookingRepository,
  NeonCustomerRepository,
} from './repositories/neon.repository.js';

@Module({
  imports: [],
  controllers: [ApiController, AuthController, AdminFleetController, PaymentsController],
  providers: [
    SecurityService,
    NeonService,
    NeonFleetRepository,
    NeonCustomerRepository,
    {
      provide: NeonBookingRepository,
      useFactory: (fleet: NeonFleetRepository, neon: NeonService) =>
        new NeonBookingRepository(fleet, neon),
      inject: [NeonFleetRepository, NeonService],
    },
    // Bind base tokens to Neon-backed implementations
    {
      provide: MemoryFleetRepository,
      useExisting: NeonFleetRepository,
    },
    {
      provide: MemoryCustomerRepository,
      useExisting: NeonCustomerRepository,
    },
    {
      provide: MemoryBookingRepository,
      useExisting: NeonBookingRepository,
    },
  ],
})
export class AppModule {}
