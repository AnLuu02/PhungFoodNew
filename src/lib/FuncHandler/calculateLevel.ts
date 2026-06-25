import { UserLevel, VoucherType } from '@prisma/client';
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

export const caculateAmount = ({
  products,
  vouchers
}: {
  products: { price: number; quantity: number; discount: number }[];
  vouchers: ({ discountValue: number; maxDiscount: number; minOrderPrice: number; type: VoucherType } | number)[];
}) => {
  const { totalOriginalPrice, totalProductDiscount } = products.reduce(
    (acc, item) => {
      acc.totalOriginalPrice += item.price * item.quantity;
      acc.totalProductDiscount += item.discount * item.quantity;
      return acc;
    },
    {
      totalOriginalPrice: 0,
      totalProductDiscount: 0
    }
  );

  const priceAfterProductDiscount = totalOriginalPrice - totalProductDiscount;

  const totalVoucherAmount = vouchers.reduce((sum: number, item) => {
    if (typeof item === 'number') return sum + item;
    if (priceAfterProductDiscount < item.minOrderPrice) return sum;
    const discount =
      item.type === VoucherType.FIXED
        ? item.discountValue
        : Math.min((priceAfterProductDiscount * item.discountValue) / 100, item.maxDiscount);

    return sum + discount;
  }, 0);

  const subTotal = Math.max(priceAfterProductDiscount - totalVoucherAmount, 0);
  const tax = subTotal * 0.08;
  const finalAmount = subTotal + tax;

  return {
    totalOriginalPrice,
    totalProductDiscount,
    totalVoucherAmount,
    totalDiscountAmount: totalProductDiscount + totalVoucherAmount,
    subTotal,
    tax,
    finalAmount
  };
};
