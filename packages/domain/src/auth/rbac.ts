export const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'FLEET_MANAGER', 'SUPPORT'] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const PERMISSIONS = [
  // Fleet
  'vehicles:read',
  'vehicles:write',
  'maintenance:manage',
  // Locations
  'locations:read',
  'locations:write',
  // Pricing & coupons
  'pricing:read',
  'pricing:write',
  'coupons:manage',
  // Bookings
  'bookings:read',
  'bookings:modify',
  'bookings:cancel',
  'bookings:handover',
  // Customers & KYC
  'customers:read',
  'customers:suspend',
  'kyc:review',
  // Payments & Refunds
  'payments:read',
  'refunds:issue',
  // Staff
  'staff:manage',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<StaffRole, readonly Permission[]> = {
  SUPER_ADMIN: PERMISSIONS,
  ADMIN: [
    'vehicles:read',
    'vehicles:write',
    'maintenance:manage',
    'locations:read',
    'locations:write',
    'pricing:read',
    'pricing:write',
    'coupons:manage',
    'bookings:read',
    'bookings:modify',
    'bookings:cancel',
    'bookings:handover',
    'customers:read',
    'customers:suspend',
    'kyc:review',
    'payments:read',
    'refunds:issue',
  ],
  FLEET_MANAGER: [
    'vehicles:read',
    'vehicles:write',
    'maintenance:manage',
    'locations:read',
    'bookings:read',
    'bookings:handover',
  ],
  SUPPORT: [
    'vehicles:read',
    'locations:read',
    'bookings:read',
    'bookings:modify',
    'bookings:cancel',
    'customers:read',
    'payments:read',
  ],
};

export function hasPermission(role: StaffRole, requiredPermission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role];
  return allowed.includes(requiredPermission);
}

export function getRolePermissions(role: StaffRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}
