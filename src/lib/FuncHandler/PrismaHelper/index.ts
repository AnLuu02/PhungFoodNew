import { OrderStatus, PrismaClient } from '@prisma/client';
import dayjs from '~/lib/dayjs';
import { defaultValueCompareReturn } from '~/shared/constants/statistics.constants';
import { CompareOptions, CompareReturn } from '~/shared/types';
import { caculateLevelUser } from '../calculateLevel';
import { calcChangeRate } from '../Statistics';
export const buildSortFilter = (sort: string[], sortValue: string[]) => {
  const orderBy: Record<string, string>[] = [];

  sortValue.forEach(item => {
    if (sort?.includes(`${item}-asc`) || sort?.includes(`${item}-desc`)) {
      orderBy.push({
        [item]: sort.includes(`${item}-asc`) ? 'asc' : 'desc'
      });
    }
  });
  return orderBy?.map(item => item).filter(Boolean);
};

export async function updateRevenue(
  db: PrismaClient,
  status: OrderStatus,
  userId: string,
  order: { originalAmount: number; discountAmount: number; finalAmount: number; createdAt?: Date | null }
) {
  const { originalAmount, discountAmount, finalAmount, createdAt } = order;
  const currentDate = createdAt ? dayjs.utc(createdAt).tz('Asia/Ho_Chi_Minh') : dayjs().tz('Asia/Ho_Chi_Minh');
  const day = currentDate.date();
  const month = currentDate.month() + 1;
  const year = currentDate.year();

  await db.revenue.upsert({
    where: { userId_year_month_day: { userId, year, month, day } },
    update: {
      totalSpent: status === OrderStatus.COMPLETED ? { increment: originalAmount } : { decrement: originalAmount },
      grossRevenue: status === OrderStatus.COMPLETED ? { increment: originalAmount } : { decrement: originalAmount },
      netRevenue: status === OrderStatus.COMPLETED ? { increment: finalAmount } : { decrement: finalAmount },
      totalCustomers: 0,
      totalDiscount: status === OrderStatus.COMPLETED ? { increment: discountAmount } : { decrement: discountAmount },
      totalOrders: status === OrderStatus.COMPLETED ? { increment: 1 } : { decrement: 1 },
      updatedAt: createdAt ? new Date(createdAt) : new Date()
    },
    create: {
      userId,
      day,
      year,
      month,
      totalSpent: originalAmount,
      grossRevenue: originalAmount,
      netRevenue: finalAmount,
      totalDiscount: discountAmount,
      totalCustomers: 0,
      totalOrders: 1,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      updatedAt: createdAt ? new Date(createdAt) : new Date()
    }
  });
}

export async function updatepointUser(db: PrismaClient, userId: string, orderTotalPrice: number) {
  const user = await db.user.update({
    where: { id: userId },
    data: {
      pointUser: { increment: orderTotalPrice >= 10000 ? orderTotalPrice / 10000 : 0 }
    }
  });
  if (user) {
    const { currentLevel, nextLevel, currentPoint } = caculateLevelUser({
      level: user?.level,
      pointUser: user?.pointUser
    });
    if (currentPoint > currentLevel.maxPoint) {
      await db.user.update({
        where: { id: userId },
        data: {
          level: nextLevel.key
        }
      });
    }
  }
}

export async function updateSales(db: PrismaClient, status: OrderStatus, productId: string, soldQuantity: number) {
  await db.product.update({
    where: { id: productId },
    data: {
      soldQuantity: status === OrderStatus.COMPLETED ? { increment: soldQuantity } : { decrement: soldQuantity },
      availableQuantity: status === OrderStatus.COMPLETED ? { decrement: soldQuantity } : { increment: soldQuantity }
    }
  });
}

export async function getCompare({
  period,
  db,
  model,
  field = '*',
  aggregateFn = 'COUNT',
  startDate,
  endDate
}: CompareOptions): Promise<CompareReturn> {
  let compareReturn: CompareReturn = defaultValueCompareReturn;
  if (period === '_all' || !startDate || !endDate) {
    const firstOpened = await db.restaurant.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true }
    });

    if (!firstOpened || !firstOpened.createdAt) {
      return defaultValueCompareReturn;
    }
    compareReturn.current.startDate = dayjs(firstOpened.createdAt).toDate();
    compareReturn.current.endDate = dayjs().toDate();
  }
  compareReturn.current.startDate = dayjs(startDate).toDate();
  compareReturn.current.endDate = dayjs(endDate).toDate();

  switch (period) {
    case '_today': {
      const prevEndDate = dayjs().subtract(1, 'day').toDate();
      const prevStartDate = dayjs().subtract(1, 'day').startOf('day').toDate();
      const result = await calcChangeRate({
        period,
        db,
        model,
        aggregateFn,
        field,
        endDate: compareReturn.current.endDate,
        startDate: compareReturn.current.startDate,
        previousEndDate: prevEndDate,
        previousStartDate: prevStartDate
      });

      compareReturn = {
        ...compareReturn,
        ...result
      };
      break;
    }
    case '7_day': {
      const prevStartDate = dayjs().subtract(14, 'day').startOf('day').toDate();
      const prevEndDate = dayjs().subtract(7, 'day').toDate();
      const result = await calcChangeRate({
        period,
        db,
        model,
        aggregateFn,
        field,
        endDate: compareReturn.current.endDate,
        startDate: compareReturn.current.startDate,
        previousEndDate: prevEndDate,
        previousStartDate: prevStartDate
      });

      compareReturn = {
        ...compareReturn,
        ...result
      };
      break;
    }
    case '15_day': {
      const prevStartDate = dayjs().subtract(30, 'day').startOf('day').toDate();
      const prevEndDate = dayjs().subtract(15, 'day').toDate();
      const result = await calcChangeRate({
        period,
        db,
        model,
        aggregateFn,
        field,
        endDate: compareReturn.current.endDate,
        startDate: compareReturn.current.startDate,
        previousEndDate: prevEndDate,
        previousStartDate: prevStartDate
      });

      compareReturn = {
        ...compareReturn,
        ...result
      };
      break;
    }
    case '1_month': {
      const prevEndDate = dayjs(endDate).subtract(1, 'month').toDate();
      const prevStartDate = dayjs(startDate).subtract(1, 'month').startOf('month').toDate();
      const result = await calcChangeRate({
        period,
        db,
        model,
        aggregateFn,
        field,
        endDate: compareReturn.current.endDate,
        startDate: compareReturn.current.startDate,
        previousEndDate: prevEndDate,
        previousStartDate: prevStartDate
      });

      compareReturn = {
        ...compareReturn,
        ...result
      };

      break;
    }
    case '3_month': {
      const prevEndDate = dayjs(endDate).subtract(3, 'month').toDate();
      const prevStartDate = dayjs(startDate).subtract(3, 'month').startOf('month').toDate();
      const result = await calcChangeRate({
        period,
        db,
        model,
        aggregateFn,
        field,
        endDate: compareReturn.current.endDate,
        startDate: compareReturn.current.startDate,
        previousEndDate: prevEndDate,
        previousStartDate: prevStartDate
      });

      compareReturn = {
        ...compareReturn,
        ...result
      };
      break;
    }
    case '6_month': {
      const prevEndDate = dayjs(endDate).subtract(6, 'month').toDate();
      const prevStartDate = dayjs(startDate).subtract(6, 'month').startOf('month').toDate();
      const result = await calcChangeRate({
        period,
        db,
        model,
        aggregateFn,
        field,
        endDate: compareReturn.current.endDate,
        startDate: compareReturn.current.startDate,
        previousEndDate: prevEndDate,
        previousStartDate: prevStartDate
      });

      compareReturn = {
        ...compareReturn,
        ...result
      };
      break;
    }
    case '1_year': {
      const prevEndDate = dayjs(endDate).subtract(1, 'year').toDate();
      const prevStartDate = dayjs(startDate).subtract(1, 'year').startOf('year').toDate();
      const result = await calcChangeRate({
        period,
        db,
        model,
        aggregateFn,
        field,
        endDate: compareReturn.current.endDate,
        startDate: compareReturn.current.startDate,
        previousEndDate: prevEndDate,
        previousStartDate: prevStartDate
      });

      compareReturn = {
        ...compareReturn,
        ...result
      };
      break;
    }

    case '_custom': {
      const sizePeriod = dayjs(endDate).diff(dayjs(startDate), 'day');
      const prevStartDate = dayjs(startDate).subtract(sizePeriod, 'day').startOf('day').toDate();
      const prevEndDate = dayjs(endDate).subtract(sizePeriod, 'day').toDate();
      const result = await calcChangeRate({
        period,
        db,
        model,
        aggregateFn,
        field,
        endDate: compareReturn.current.endDate,
        startDate: compareReturn.current.startDate,
        previousEndDate: prevEndDate,
        previousStartDate: prevStartDate
      });

      compareReturn = {
        ...compareReturn,
        ...result
      };
      break;
    }
    default: {
      const prevEndDate = dayjs(endDate).subtract(1, 'year').toDate();
      const prevStartDate = dayjs(startDate).subtract(1, 'year').startOf('year').toDate();
      const result = await calcChangeRate({
        period,
        db,
        model,
        aggregateFn,
        field,
        endDate: compareReturn.current.endDate,
        startDate: compareReturn.current.startDate,
        previousEndDate: prevEndDate,
        previousStartDate: prevStartDate
      });

      compareReturn = {
        ...compareReturn,
        ...result
      };
      break;
    }
  }

  return compareReturn;
}
