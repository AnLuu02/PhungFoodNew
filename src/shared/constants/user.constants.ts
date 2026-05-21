export const UserRole = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER'
} as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];
