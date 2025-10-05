import { OrderStatus } from '@prisma/client';
import { LocalOrderStatus } from '~/lib/zod/EnumType';

export const buildSortFilter = (sort: any, sortValue: any[]) => {
  const orderBy: any[] = [];

  sortValue.forEach(item => {
    if (sort?.includes(`${item}-asc`) || sort?.includes(`${item}-desc`)) {
      orderBy.push({
        [item]: sort.includes(`${item}-asc`) ? 'asc' : 'desc'
      });
    }
  });
  return orderBy?.map(item => item).filter(Boolean);
};

export function getDateRange(year: any, month: any, day: any) {
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);
  if (!start || !end) return {};
  return { start, end };
}

export async function updateRevenue(ctx: any, status: OrderStatus, userId: string, order: any) {
  const orderTotal = order.finalTotal || 0;
  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  await ctx.db.revenue.upsert({
    where: { userId_year_month_day: { userId, year, month, day } },
    update: {
      totalSpent: status === LocalOrderStatus.COMPLETED ? { increment: orderTotal } : { decrement: orderTotal },
      totalOrders: status === LocalOrderStatus.COMPLETED ? { increment: 1 } : { decrement: 1 },
      orders: {
        connect: { id: order.id }
      }
    },
    create: { userId, day, year, month, totalSpent: orderTotal, totalOrders: 1, orders: { connect: { id: order.id } } }
  });
}

export async function updatepointUser(ctx: any, userId: string, orderTotalPrice: number) {
  await ctx.db.user.update({
    where: { id: userId },
    data: {
      pointUser: { increment: orderTotalPrice >= 10000 ? orderTotalPrice / 10000 : 0 }
    }
  });
}

export async function updateSales(ctx: any, status: OrderStatus, productId: string, soldQuantity: number) {
  await ctx.db.product.update({
    where: { id: productId },
    data: {
      soldQuantity: status === LocalOrderStatus.COMPLETED ? { increment: soldQuantity } : { decrement: soldQuantity },
      availableQuantity:
        status === LocalOrderStatus.COMPLETED ? { decrement: soldQuantity } : { increment: soldQuantity }
    }
  });
}

//revenue

interface CompareOptions {
  db: any;
  model: any;
  field: string;
  mode: 'sum' | 'count';
  startDate?: Date;
  endDate?: Date;
}

export async function getCompare({ db, model, field, mode, startDate, endDate }: CompareOptions) {
  const modelDelegate = db[model] as any;

  if (!startDate || !endDate) {
    const firstRecord = await modelDelegate.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true }
    });

    if (!firstRecord) {
      return { currentValue: 0, previousValue: 0, changeRate: null };
    }

    let total: number;
    if (mode === 'sum') {
      const res = await modelDelegate.aggregate({
        _sum: { [field]: true }
      });
      total = res._sum[field] ?? 0;
    } else {
      const res = await modelDelegate.aggregate({
        _count: { [field]: true }
      });
      total = res._count[field] ?? 0;
    }

    return { currentValue: total, previousValue: 0, changeRate: null };
  }

  const diff = endDate.getTime() - startDate.getTime();
  const prevStart = new Date(startDate.getTime() - diff);
  const prevEnd = new Date(endDate.getTime() - diff);

  let currentValue: number;
  let previousValue: number;

  if (mode === 'sum') {
    const current = await modelDelegate.aggregate({
      _sum: { [field]: true },
      where: { createdAt: { gte: startDate, lte: endDate } }
    });
    const previous = await modelDelegate.aggregate({
      _sum: { [field]: true },
      where: { createdAt: { gte: prevStart, lte: prevEnd } }
    });

    currentValue = current._sum[field] ?? 0;
    previousValue = previous._sum[field] ?? 0;
  } else {
    const current = await modelDelegate.aggregate({
      _count: { [field]: true },
      where: { createdAt: { gte: startDate, lte: endDate } }
    });
    const previous = await modelDelegate.aggregate({
      _count: { [field]: true },
      where: { createdAt: { gte: prevStart, lte: prevEnd } }
    });

    currentValue = current._count[field] ?? 0;
    previousValue = previous._count[field] ?? 0;
  }

  const changeRate = previousValue === 0 ? null : ((currentValue - previousValue) / previousValue) * 100;

  return { currentValue, previousValue, changeRate };
}
