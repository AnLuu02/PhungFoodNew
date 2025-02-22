import { UserLevel } from '@prisma/client';

export const getLevelUser = (key: UserLevel) => {
  switch (key) {
    case UserLevel.DONG:
      return 'ĐỒNG';
    case UserLevel.BAC:
      return 'BẠC';
    case UserLevel.VANG:
      return 'VÀNG';
    case UserLevel.BACHKIM:
      return 'BẠCH KIM';
    default:
      return 'KIM CƯƠNG';
  }
};
