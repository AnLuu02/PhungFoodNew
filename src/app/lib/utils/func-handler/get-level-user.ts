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

export const getColorLevelUser = (key: UserLevel) => {
  switch (key) {
    case UserLevel.BRONZE:
      return 'orange.7';
    case UserLevel.SILVER:
      return 'gray.5';
    case UserLevel.GOLD:
      return 'yellow.6';
    case UserLevel.PLATINUM:
      return 'blue.4';
    case UserLevel.DIAMOND:
      return 'cyan.4';
    default:
      return 'cyan.4';
  }
};
