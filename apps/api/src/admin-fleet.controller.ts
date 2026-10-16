import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  CreateCitySchema,
  UpdateCitySchema,
  CreateLocationSchema,
  UpdateLocationSchema,
  CreateVehicleSchema,
  UpdateVehicleSchema,
  UpdateVehicleStatusSchema,
  AddVehicleDocumentSchema,
} from '@newlink/contracts';
import { MemoryFleetRepository } from './repositories/memory.repository.js';

@Controller('api/v1/admin')
export class AdminFleetController {
  constructor(@Inject(MemoryFleetRepository) private fleetRepo: MemoryFleetRepository) {}

  @Get('cities')
  async getAllCities() {
    const cities = await this.fleetRepo.getCities();
    return { data: cities };
  }

  @Post('cities')
  async createCity(@Body() body: unknown) {
    const parse = CreateCitySchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid city data', details: parse.error.issues } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const created = await this.fleetRepo.createCity(parse.data);
    return { data: created };
  }

  @Patch('cities/:id')
  async updateCity(@Param('id') id: string, @Body() body: unknown) {
    const parse = UpdateCitySchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid city updates', details: parse.error.issues } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const updated = await this.fleetRepo.updateCity(id, parse.data);
    return { data: updated };
  }

  @Get('locations')
  async getAllLocations() {
    const locations = await this.fleetRepo.getLocations();
    return { data: locations };
  }

  @Post('locations')
  async createLocation(@Body() body: unknown) {
    const parse = CreateLocationSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid location data', details: parse.error.issues } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const created = await this.fleetRepo.createLocation(parse.data);
    return { data: created };
  }

  @Patch('locations/:id')
  async updateLocation(@Param('id') id: string, @Body() body: unknown) {
    const parse = UpdateLocationSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid location updates', details: parse.error.issues } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const updated = await this.fleetRepo.updateLocation(id, parse.data);
    return { data: updated };
  }

  /* ---------------------------------------------------------------------------------------- */
  /* Vehicle Fleet & Compliance Admin Endpoints                                               */
  /* ---------------------------------------------------------------------------------------- */

  @Get('vehicles')
  async getAllVehicles(
    @Query('cityId') cityId?: string,
    @Query('locationId') locationId?: string,
  ) {
    const vehicles = await this.fleetRepo.getAdminVehicles(cityId, locationId);
    return { data: vehicles };
  }

  @Get('vehicles/:id')
  async getVehicleById(@Param('id') id: string) {
    const vehicle = await this.fleetRepo.getAdminVehicleById(id);
    if (!vehicle) {
      throw new HttpException(
        { error: { code: 'NOT_FOUND', message: 'Vehicle not found' } },
        HttpStatus.NOT_FOUND,
      );
    }
    return { data: vehicle };
  }

  @Post('vehicles')
  async createVehicle(@Body() body: unknown) {
    const parse = CreateVehicleSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid vehicle data', details: parse.error.issues } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const created = await this.fleetRepo.createVehicle(parse.data);
    return { data: created };
  }

  @Patch('vehicles/:id')
  async updateVehicle(@Param('id') id: string, @Body() body: unknown) {
    const parse = UpdateVehicleSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid vehicle updates', details: parse.error.issues } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const updated = await this.fleetRepo.updateVehicle(id, parse.data);
    return { data: updated };
  }

  @Patch('vehicles/:id/status')
  async updateVehicleStatus(@Param('id') id: string, @Body() body: unknown) {
    const parse = UpdateVehicleStatusSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid status data', details: parse.error.issues } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const updated = await this.fleetRepo.updateVehicleStatus(id, parse.data.operationalStatus, parse.data.reason);
    return { data: updated };
  }

  @Post('vehicles/:id/documents')
  async addVehicleDocument(@Param('id') id: string, @Body() body: unknown) {
    const parse = AddVehicleDocumentSchema.safeParse(body);
    if (!parse.success) {
      throw new HttpException(
        { error: { code: 'VALIDATION_FAILED', message: 'Invalid document data', details: parse.error.issues } },
        HttpStatus.BAD_REQUEST,
      );
    }
    const created = await this.fleetRepo.addVehicleDocument(id, parse.data);
    return { data: created };
  }
}

