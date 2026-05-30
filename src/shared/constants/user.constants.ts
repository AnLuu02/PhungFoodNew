export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER'
} as const;

export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF'] as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];
