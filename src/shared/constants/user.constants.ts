import { UserLevel } from '@prisma/client';

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER'
} as const;

export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF'] as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];

export const INFO_LEVEL_USER = {
  [UserLevel.BRONZE]: {
    value: 0,
    key: UserLevel.BRONZE,
    minPoint: 0,
    maxPoint: 999,
    viName: 'ĐỒNG',
    enName: 'BRONZE',
    color: '#3F2627',
    thumbnail: 'rank_dong.png',
    nextLevel: UserLevel.SILVER
  },
  [UserLevel.SILVER]: {
    value: 1,
    key: UserLevel.SILVER,
    minPoint: 1000,
    maxPoint: 2999,
    viName: 'BẠC',
    enName: 'SILVER',
    color: '#64707A',
    thumbnail: 'rank_bac.png',
    nextLevel: UserLevel.GOLD
  },
  [UserLevel.GOLD]: {
    value: 2,
    key: UserLevel.GOLD,
    minPoint: 3000,
    maxPoint: 7999,
    viName: 'VÀNG',
    enName: 'GOLD',
    color: '#523917',
    thumbnail: 'rank_vang.png',
    nextLevel: UserLevel.PLATINUM
  },
  [UserLevel.PLATINUM]: {
    value: 3,
    key: UserLevel.PLATINUM,
    minPoint: 8000,
    maxPoint: 14999,
    viName: 'BẠCH KIM',
    enName: 'PLATINUM',
    color: '#4183A7',
    thumbnail: 'rank_bk.png',
    nextLevel: UserLevel.DIAMOND
  },
  [UserLevel.DIAMOND]: {
    value: 4,
    key: UserLevel.DIAMOND,
    minPoint: 15000,
    maxPoint: 99999,
    viName: 'KIM CƯƠNG',
    enName: 'DIAMOND',
    color: '#5F77C3',
    thumbnail: 'rank_kc.png',
    nextLevel: UserLevel.DIAMOND
  }
};
