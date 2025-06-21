import { UserLevel } from '@prisma/client';
import { LocalUserLevel } from '../zod/EnumType';

export const getLevelUser = (key: UserLevel) => {
  switch (key) {
    case LocalUserLevel.BRONZE:
      return 'ĐỒNG';
    case LocalUserLevel.SILVER:
      return 'BẠC';
    case LocalUserLevel.GOLD:
      return 'VÀNG';
    case LocalUserLevel.PLATINUM:
      return 'BẠCH KIM';
    case LocalUserLevel.DIAMOND:
      return 'KIM CƯƠNG';
    default:
      return 'KIM CƯƠNG';
  }
};

export const getColorLevelUser = (key: UserLevel) => {
  switch (key) {
    case LocalUserLevel.BRONZE:
      return 'orange.7';
    case LocalUserLevel.SILVER:
      return 'gray.5';
    case LocalUserLevel.GOLD:
      return 'yellow.6';
    case LocalUserLevel.PLATINUM:
      return 'blue.4';
    case LocalUserLevel.DIAMOND:
      return 'cyan.4';
    default:
      return 'cyan.4';
  }
};
