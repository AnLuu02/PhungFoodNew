import { UserLevel } from '@prisma/client';

export const getValueLevelUser = (key: UserLevel) => {
  switch (key) {
    case UserLevel.BRONZE:
      return 0;
    case UserLevel.SILVER:
      return 1;
    case UserLevel.GOLD:
      return 2;
    case UserLevel.PLATINUM:
      return 3;
    case UserLevel.DIAMOND:
      return 4;
    default:
      return 4;
  }
};
