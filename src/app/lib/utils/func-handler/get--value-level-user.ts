import { UserLevel } from '@prisma/client';
import { LocalUserLevel } from '../zod/EnumType';

export const getValueLevelUser = (key: UserLevel) => {
  switch (key) {
    case LocalUserLevel.BRONZE:
      return 0;
    case LocalUserLevel.SILVER:
      return 1;
    case LocalUserLevel.GOLD:
      return 2;
    case LocalUserLevel.PLATINUM:
      return 3;
    case LocalUserLevel.DIAMOND:
      return 4;
    default:
      return 4;
  }
};
