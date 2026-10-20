import { type Paise, assertPaise } from '../money.js';

export interface FleetOccupancyInput {
  readonly totalVehicles: number;
  readonly rentedVehicles: number;
  readonly maintenanceVehicles: number;
}

export interface FleetOccupancyResult {
  readonly total: number;
  readonly rented: number;
  readonly available: number;
  readonly maintenance: number;
  /** Occupancy percentage formatted to 1 decimal place, e.g. 75.0 */
  readonly occupancyRatePercent: number;
  /** In-service availability percentage, e.g. 85.0 */
  readonly serviceabilityPercent: number;
}

/**
 * Computes fleet utilization and occupancy metrics.
 */
export function calculateFleetOccupancy(input: FleetOccupancyInput): FleetOccupancyResult {
  const { totalVehicles, rentedVehicles, maintenanceVehicles } = input;
  if (totalVehicles <= 0) {
    return {
      total: 0,
      rented: 0,
      available: 0,
      maintenance: 0,
      occupancyRatePercent: 0,
      serviceabilityPercent: 0,
    };
  }

  const available = Math.max(0, totalVehicles - rentedVehicles - maintenanceVehicles);
  const inService = totalVehicles - maintenanceVehicles;

  const occupancyRatePercent =
    inService > 0 ? Math.round((rentedVehicles / inService) * 1000) / 10 : 0;

  const serviceabilityPercent = Math.round((inService / totalVehicles) * 1000) / 10;

  return {
    total: totalVehicles,
    rented: rentedVehicles,
    available,
    maintenance: maintenanceVehicles,
    occupancyRatePercent,
    serviceabilityPercent,
  };
}

/**
 * Computes Revenue Per Available Car (RevPAC) in integer paise.
 * RevPAC = Total Rental Revenue / Available Cars
 */
export function calculateRevPAC(totalRevenuePaise: Paise, availableCarsCount: number): Paise {
  assertPaise(totalRevenuePaise);
  if (availableCarsCount <= 0) {
    return 0 as Paise;
  }
  return Math.round(totalRevenuePaise / availableCarsCount) as Paise;
}

export interface CityAnalyticsSummary {
  readonly cityId: string;
  readonly cityName: string;
  readonly totalFleet: number;
  readonly activeRentals: number;
  readonly revenuePaise: Paise;
  readonly occupancyRatePercent: number;
  readonly revPacPaise: Paise;
}

export function aggregateCityMetrics(
  cities: readonly {
    id: string;
    name: string;
    vehicles: readonly { status: 'IN_SERVICE' | 'MAINTENANCE' | 'INACTIVE'; isRented: boolean }[];
    revenuePaise: Paise;
  }[],
): readonly CityAnalyticsSummary[] {
  return cities.map((c) => {
    const totalFleet = c.vehicles.length;
    const maintenance = c.vehicles.filter((v) => v.status === 'MAINTENANCE').length;
    const activeRentals = c.vehicles.filter((v) => v.isRented).length;

    const occupancy = calculateFleetOccupancy({
      totalVehicles: totalFleet,
      rentedVehicles: activeRentals,
      maintenanceVehicles: maintenance,
    });

    const inServiceCount = Math.max(1, totalFleet - maintenance);
    const revPac = calculateRevPAC(c.revenuePaise, inServiceCount);

    return {
      cityId: c.id,
      cityName: c.name,
      totalFleet,
      activeRentals,
      revenuePaise: c.revenuePaise,
      occupancyRatePercent: occupancy.occupancyRatePercent,
      revPacPaise: revPac,
    };
  });
}
