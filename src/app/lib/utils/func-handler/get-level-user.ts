import { UserLevel } from '@prisma/client';

export const getLevelUser = (key: UserLevel) => {
  switch (key) {
    case UserLevel.BRONZE:
      return 'ĐỒNG';
    case UserLevel.SILVER:
      return 'BẠC';
    case UserLevel.GOLD:
      return 'VÀNG';
    case UserLevel.PLATINUM:
      return 'BẠCH KIM';
    case UserLevel.DIAMOND:
      return 'KIM CƯƠNG';
    default:
      return 'KIM CƯƠNG';
  }
};
