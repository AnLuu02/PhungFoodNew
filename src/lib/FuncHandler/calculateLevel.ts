import { UserLevel } from '@prisma/client';
import { INFO_LEVEL_USER } from '~/shared/constants/user.constants';
import { benefitLevel } from '../HardData/promotion-level';

export const caculateLevelUser = ({ level, pointUser }: { level?: UserLevel; pointUser?: number }) => {
  const currentLevelKey = level ?? UserLevel.BRONZE;
  const LEVEL = INFO_LEVEL_USER[currentLevelKey];

  const NEXT_LEVEL = LEVEL.key === LEVEL.nextLevel ? LEVEL : INFO_LEVEL_USER[LEVEL.nextLevel];

  const currentPoint = pointUser ?? 0;
  const pointRemaining = NEXT_LEVEL.minPoint - currentPoint <= 0 ? 0 : NEXT_LEVEL.minPoint - currentPoint;

  const isMaxLevel = pointRemaining <= 0;

  const levelText = isMaxLevel
    ? 'Bạn đã đạt hạng thành viên cao nhất của nhà hàng.'
    : `Còn ${pointRemaining} điểm để lên hạng ${NEXT_LEVEL.viName}`;

  const progressRemainingValue = isMaxLevel ? 100 : Math.min((currentPoint / NEXT_LEVEL.minPoint) * 100, 100);

  return {
    currentPoint,
    pointRemaining,
    benefit: benefitLevel[currentLevelKey],
    progressRemainingValue,
    currentLevel: LEVEL,
    nextLevel: NEXT_LEVEL,
    isMaxLevel,
    levelText
  };
};
