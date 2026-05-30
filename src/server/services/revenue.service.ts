import { OrderStatus, PrismaClient } from '@prisma/client';
import dayjs from '~/lib/dayjs';
import { getCompare } from '~/lib/FuncHandler/PrismaHelper';
import { getDatesObjBetween } from '~/lib/FuncHandler/Statistics';
import { defaultValueCompareReturn } from '~/shared/constants/statistics.constants';
import { Period } from '~/shared/types';

const buildQuery = (startTime?: number, endTime?: number) => {
  const startTimeToDate = startTime ? dayjs(startTime).utc().toDate() : undefined;
  const endTimeToDate = endTime ? dayjs(endTime).utc().toDate() : undefined;
  return {
    createdAt: {
      gte: startTimeToDate,
      lte: endTimeToDate
    }
  };
};

export const getTotalSpentInMonthByUserService = async (db: PrismaClient, input: { userId: string; year: number }) => {
  const revenues = await db.revenue.groupBy({
    by: ['month'],
    where: { userId: input.userId, year: input.year || 2025 },
    _sum: { totalSpent: true },
    orderBy: { month: 'asc' }
  });
  return revenues?.map(item => {
    return {
      month: item.month,
      totalSpent: item._sum.totalSpent,
      year: input.year
    };
  });
};

export const getTopUsersService = async (
  db: PrismaClient,
  input: { startTime?: number; endTime?: number; limit?: number }
) => {
  const { startTime, endTime } = input;
  const where = buildQuery(startTime, endTime);
  const revenues = await db.revenue.groupBy({
    by: ['userId'],
    where: where as any,
    _sum: { totalSpent: true, totalOrders: true },
    orderBy: { _sum: { totalSpent: 'desc' } },
    take: input.limit || 5
  });
  const userIds = revenues.map(revenue => revenue.userId);

  const users =
    userIds?.length > 0
      ? await db.user.findMany({
          where: {
            id: { in: userIds }
          },
          select: {
            id: true,
            name: true,
            email: true
          }
        })
      : [];
  return revenues.map(item => {
    const user = users.find((user: (typeof users)[number]) => user.id === item.userId);
    return {
      userId: item.userId,
      totalSpent: item._sum.totalSpent,
      totalOrders: item._sum.totalOrders,
      user: user
    };
  });
};
export const getTopProductsService = async (db: PrismaClient, input: { startTime?: number; endTime?: number }) => {
  const { startTime, endTime } = input;
  const where = buildQuery(startTime, endTime);
  const data = await db.orderItem.findMany({
    where: where as any,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          subCategory: {
            select: {
              name: true
            }
          },
          price: true,
          soldQuantity: true
        }
      }
    }
  });

  const topProducts = data
    .reduce(
      (
        acc: { product: (typeof data)[number]['product']; soldQuantity: number; profit: number }[],
        item: (typeof data)[number]
      ) => {
        const existed = acc.find((it: (typeof acc)[number]) => it?.product?.id === item?.product?.id);
        if (!existed) {
          acc.push({
            product: item?.product,
            soldQuantity: item?.quantity,
            profit: item?.product?.price * item?.quantity || 0
          });
        } else {
          existed.soldQuantity += item?.quantity || 0;
          existed.profit += item?.product?.price * item?.quantity || 0;
        }
        return acc;
      },
      []
    )
    .sort((a, b) => b.profit - a.profit);

  return topProducts;
};
export const getDistributionProductsService = async (
  db: PrismaClient,
  input: { startTime?: number; endTime?: number }
) => {
  const { startTime, endTime } = input;
  const where = buildQuery(startTime, endTime);
  const result = await db.orderItem.groupBy({
    by: ['productId'],
    where: where as any,
    _sum: {
      price: true
    },
    orderBy: {
      _sum: {
        price: 'desc'
      }
    },
    take: 5
  });
  const data = await db.category.findMany({
    include: {
      subCategory: {
        select: {
          name: true,
          products: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
  const distributionProducts = data.reduce((acc: any, item: (typeof data)[number]) => {
    item?.subCategory?.forEach((subCategory: (typeof item)['subCategory'][number]) => {
      if (!acc[item?.name]) {
        acc[item?.name] = subCategory?.products?.length || 0;
      } else {
        acc[item?.name] += subCategory?.products?.length || 0;
      }
    });
    return acc;
  }, {});

  return distributionProducts;
};
export const getRevenueOrderStatusService = async (
  db: PrismaClient,
  input: { startTime?: number; endTime?: number }
) => {
  const { startTime, endTime } = input;
  const where = buildQuery(startTime, endTime);

  const data = await db.order.findMany({
    where: where as any,
    include: {
      orderItems: true
    }
  });
  const revenueByOrderStatus = data.reduce(
    (acc: { status: OrderStatus; totalOrders: number; profit: number }[], item: (typeof data)[number]) => {
      const existed = acc.find((it: (typeof acc)[number]) => it?.status === item?.status);
      if (!existed) {
        acc.push({
          status: item?.status,
          totalOrders: 1,
          profit: item?.finalTotal || 0
        });
      } else {
        existed.totalOrders += 1;
        existed.profit += item?.finalTotal || 0;
      }
      return acc;
    },
    []
  );
  return revenueByOrderStatus;
};
export const getRevenueByCategoryService = async (
  db: PrismaClient,
  input: { startTime?: number; endTime?: number }
) => {
  const { startTime, endTime } = input;
  const where = buildQuery(startTime, endTime);
  const data = await db.orderItem.findMany({
    where: where as any,
    include: {
      product: {
        select: {
          subCategory: true
        }
      }
    }
  });

  const revenueByCategory = data.reduce((acc: any, item: (typeof data)[number]) => {
    const categoryName = item?.product?.subCategory?.name || 'Khác';
    const total = item.price * item.quantity;

    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += total;
    return acc;
  }, {});

  return revenueByCategory;
};

export const createRevenueService = async (db: PrismaClient, input: any) => {
  return await db.revenue.create({
    data: {
      userId: input.userId,
      totalSpent: input.totalSpent,
      totalOrders: input.totalOrders,
      day: input.day,
      year: input.year,
      month: input.month
    }
  });
};
export const updateRevenueService = async (db: PrismaClient, input: any) => {
  return await db.revenue.update({
    where: {
      id: input.id
    },
    data: {
      userId: input.userId,
      totalSpent: input.totalSpent,
      totalOrders: input.totalOrders,
      day: input.day,
      year: input.year,
      month: input.month
    }
  });
};
export const getOneRevenueService = async (db: PrismaClient, input: { id: string }) => {
  return await db.revenue.findUnique({
    where: {
      id: input.id
    }
  });
};
export const getAllRevenueService = async (db: PrismaClient) => {
  return await db.revenue.findMany({});
};
export const getOverviewRevenueService = async (
  db: PrismaClient,
  input: { startTime?: number; endTime?: number; period: Period }
) => {
  const { startTime, endTime, period } = input;
  let startTimeToDate = undefined,
    endTimeToDate = undefined,
    firstRevenue = undefined;

  if (startTime && endTime) {
    startTimeToDate = dayjs(startTime).utc().toDate();
    endTimeToDate = dayjs(endTime).utc().toDate();
  } else {
    firstRevenue = await db.restaurant.findFirst();
    startTimeToDate = firstRevenue?.createdAt;
    endTimeToDate = dayjs().utc().toDate();
  }

  const where = startTimeToDate &&
    endTimeToDate && {
      createdAt: {
        gte: startTimeToDate,
        lte: endTimeToDate
      }
    };

  const [totalFinal, totalUsers, totalOrders, totalProducts, revenues, users, orders] = await Promise.allSettled([
    getCompare({
      period,
      db: db,
      model: 'Revenue',
      aggregateFn: 'SUM',
      field: 'totalSpent',
      startDate: startTimeToDate,
      endDate: endTimeToDate
    }),
    getCompare({
      period,
      db: db,
      model: 'User',
      startDate: startTimeToDate,
      endDate: endTimeToDate
    }),
    // trong thực tế phải query từ  bảng order. Đây chỉ là test
    getCompare({
      period,
      db: db,
      model: 'Order',
      startDate: startTimeToDate,
      endDate: endTimeToDate
    }),
    getCompare({
      period,
      db: db,
      model: 'Product',
      startDate: startTimeToDate,
      endDate: endTimeToDate
    }),
    db.revenue.groupBy({
      by: ['day', 'month', 'year'],
      _sum: { totalSpent: true, totalOrders: true },
      where: where as any
    }),
    db.user.findMany({
      where: where as any
    }),
    db.order.findMany({
      where: where as any,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  ]);

  return {
    revenues:
      revenues.status === 'fulfilled'
        ? revenues.value.map((item: (typeof revenues.value)[number]) => {
            return {
              day: item.day,
              month: item.month,
              year: item.year,
              totalSpent: item._sum.totalSpent,
              totalOrders: item._sum.totalOrders,
              createdAt: firstRevenue?.createdAt || dayjs().utc().toDate()
            };
          })
        : [],
    totalUsers: totalUsers.status === 'fulfilled' ? totalUsers.value : defaultValueCompareReturn,
    totalOrders: totalOrders.status === 'fulfilled' ? totalOrders.value : defaultValueCompareReturn,
    totalProducts: totalProducts.status === 'fulfilled' ? totalProducts.value : defaultValueCompareReturn,
    totalFinalRevenue: totalFinal.status === 'fulfilled' ? totalFinal.value : defaultValueCompareReturn,
    users: users.status === 'fulfilled' ? users.value : [],
    orders: orders.status === 'fulfilled' ? orders.value : []
  };
};
export const getOverviewDetailRevenueService = async (
  db: PrismaClient,
  input: { startTime?: number; endTime?: number }
) => {
  const { startTime, endTime } = input;
  let startTimeToDate, endTimeToDate;
  if (startTime && endTime) {
    startTimeToDate = startTime ? dayjs(startTime).utc().toDate() : undefined;
    endTimeToDate = endTime ? dayjs(endTime).utc().toDate() : undefined;
  }
  const where = startTimeToDate &&
    endTimeToDate && {
      createdAt: {
        gte: startTimeToDate,
        lte: endTimeToDate
      }
    };

  const [totalFinal, totalUsers, totalOrders, revenues, users, orders, categories, revenueByUser] =
    await Promise.allSettled([
      db.revenue.aggregate({
        _sum: { totalSpent: true, totalOrders: true },
        where: where as any
      }),
      db.user.aggregate({
        _count: { id: true },
        where: where as any
      }),
      db.order.aggregate({
        _count: { id: true },
        where: where as any
      }),
      db.revenue.groupBy({
        by: ['day', 'month', 'year'],
        _sum: { totalSpent: true, totalOrders: true },
        where: where as any
      }),
      db.user.findMany({
        where: where as any
      }),
      db.order.findMany({
        where: where as any,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      db.orderItem.findMany({
        include: {
          product: {
            select: {
              subCategory: true
            }
          }
        }
      }),
      db.revenue.groupBy({
        by: ['userId'],
        where: where as any,
        _sum: { totalSpent: true, totalOrders: true },
        orderBy: { _sum: { totalSpent: 'desc' } },
        take: 5
      })
    ]);

  let labels: string[] = [];

  if (startTime && endTime) {
    const ojectRangeDate = getDatesObjBetween(startTime, endTime);
    labels = Object.keys(ojectRangeDate);
  }
  const summaryRevenue: Record<string, number> = {};
  labels.forEach(label => {
    summaryRevenue[label] = 0;
  });
  revenues.status === 'fulfilled' &&
    revenues.value.forEach((revenue: (typeof revenues.value)[number]) => {
      const day = +revenue.day;
      const month = +revenue.month;
      const year = +revenue.year;
      const key = `${day}/${month}/${year}`;
      if (labels.includes(key)) {
        summaryRevenue[key]! += Number(revenue._sum.totalSpent);
      }
    });

  //revenue by category

  const revenueByCategory =
    categories.status === 'fulfilled'
      ? categories.value.reduce(
          (acc: { category: string; revenue: number }[], item: (typeof categories.value)[number]) => {
            const categoryName = item?.product?.subCategory?.name || 'Khác';
            const total = item.price * item.quantity;
            const existed = acc.find((item: { category: string; revenue: number }) => item.category === categoryName);
            if (!existed) {
              acc.push({
                category: categoryName,
                revenue: total
              });
            } else {
              existed.revenue += total;
            }
            return acc;
          },
          []
        )
      : [];

  //top user
  const userIds = (revenueByUser.status === 'fulfilled' && revenueByUser.value.map(revenue => revenue.userId)) || [];

  const userData =
    userIds?.length > 0
      ? await db.user.findMany({
          where: {
            id: { in: userIds }
          },
          select: {
            id: true,
            name: true,
            email: true
          }
        })
      : [];
  const topUsers =
    (revenueByUser.status === 'fulfilled' &&
      revenueByUser.value.map(item => {
        const user = userData.find((user: (typeof userData)[number]) => user.id === item.userId);
        return {
          totalSpent: item._sum.totalSpent,
          totalOrders: item._sum.totalOrders,
          name: user?.name || 'Đang cập nhật'
        };
      })) ||
    [];
  return {
    revenuePeriod: labels.map(label => ({
      date: `Ngày ${label}`,
      revenue: summaryRevenue[label] || 0
    })),
    totalUsers: totalUsers.status === 'fulfilled' ? totalUsers.value._count.id : 0,
    totalOrders: totalOrders.status === 'fulfilled' ? totalOrders.value._count.id : 0,
    totalFinalRevenue: totalFinal.status === 'fulfilled' ? totalFinal.value._sum.totalSpent : 0,
    recentUsers: users.status === 'fulfilled' ? users.value : [],
    recentOrders: orders.status === 'fulfilled' ? orders.value : [],
    revenueByCategory,
    topUsers
  };
};
