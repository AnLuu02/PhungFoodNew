import { PrismaClient } from '@prisma/client';
import { getCompare } from '~/lib/FuncHandler/PrismaHelper';

export const getTotalSpentInMonthByUser = async (
  db: PrismaClient,
  input: {
    userId: string;
    year: number;
  }
) => {
  const revenues = await db.revenue.groupBy({
    by: ['month'],
    where: { userId: input.userId, year: input.year || 2025 },
    _sum: { totalSpent: true },
    orderBy: { month: 'asc' }
  });
  return revenues?.map(item => {
    return {
      month: item.month,
      totalSpent: Number(item._sum.totalSpent || 0),
      year: input.year
    };
  });
};

export const getTopUsers = async (
  db: PrismaClient,
  input: { startTime?: number; endTime?: number; limit?: number }
) => {
  const { startTime, endTime } = input;
  const startTimeToDate = startTime && new Date(startTime);
  const endTimeToDate = endTime && new Date(endTime);
  const where = {
    createdAt: {
      gte: startTimeToDate,
      lte: endTimeToDate
    }
  };
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
    const user = users.find((user: any) => user.id === item.userId);
    return {
      userId: item.userId,
      totalSpent: item._sum.totalSpent,
      totalOrders: item._sum.totalOrders,
      user: user
    };
  });
};
export const getTopProducts = async (db: PrismaClient, input: { startTime?: number; endTime?: number }) => {
  const { startTime, endTime } = input;
  const startTimeToDate = startTime && new Date(startTime);
  const endTimeToDate = endTime && new Date(endTime);
  const where = {
    createdAt: {
      gte: startTimeToDate,
      lte: endTimeToDate
    }
  };
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

  const topProducts = data.reduce((acc: any, item: any) => {
    const existed = acc.find((it: any) => it?.product?.id === item?.product?.id);
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
  }, []);

  return topProducts;
};

export const getDistributionProducts = async (db: PrismaClient, input: { startTime?: number; endTime?: number }) => {
  const { startTime, endTime } = input;
  const startTimeToDate = startTime && new Date(startTime);
  const endTimeToDate = endTime && new Date(endTime);
  const data = await db.category.findMany({
    include: {
      subCategories: {
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
  const distributionProducts = data.reduce((acc: any, item: any) => {
    item?.subCategory?.forEach((subCategory: any) => {
      if (!acc[item?.name]) {
        acc[item?.name] = subCategory?.product?.length || 0;
      } else {
        acc[item?.name] += subCategory?.product?.length || 0;
      }
    });
    return acc;
  }, {});

  return distributionProducts;
};
export const getRevenueOrderStatus = async (db: PrismaClient, input: { startTime?: number; endTime?: number }) => {
  const { startTime, endTime } = input;
  const startTimeToDate = startTime && new Date(startTime);
  const endTimeToDate = endTime && new Date(endTime);
  const where = {
    createdAt: {
      gte: startTimeToDate,
      lte: endTimeToDate
    }
  };
  const data = await db.order.findMany({
    where: where as any,
    include: {
      orderItems: true
    }
  });
  const revenueByOrderStatus = data.reduce((acc: any, item: any) => {
    const existed = acc.find((it: any) => it?.status === item?.status);
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
  }, []);
  return revenueByOrderStatus;
};

export const getRevenueByCategory = async (db: PrismaClient, input: { startTime?: number; endTime?: number }) => {
  const { startTime, endTime } = input;
  const startTimeToDate = startTime && new Date(startTime);
  const endTimeToDate = endTime && new Date(endTime);
  const where = {
    createdAt: {
      gte: startTimeToDate,
      lte: endTimeToDate
    }
  };
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

  const revenueByCategory = data.reduce((acc: any, item: any) => {
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
export const create = async (
  db: PrismaClient,
  input: {
    userId: string;
    totalSpent: number;
    totalOrders: number;
    day: number;
    year: number;
    month: number;
  }
) => {
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
export const update = async (
  db: PrismaClient,
  input: {
    id: string;
    userId: string;
    totalSpent: number;
    totalOrders: number;
    day: number;
    year: number;
    month: number;
  }
) => {
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
export const getOne = async (db: PrismaClient, input: { id: string }) => {
  return await db.revenue.findUnique({
    where: {
      id: input.id
    }
  });
};

export const getAll = async (db: PrismaClient) => {
  return await db.revenue.findMany({});
};
export const getOverview = async (db: PrismaClient, input: { startTime?: number; endTime?: number }) => {
  const { startTime, endTime } = input;
  let startTimeToDate, endTimeToDate, firstRevenue: any;
  if (startTime && endTime) {
    startTimeToDate = startTime ? new Date(startTime) : undefined;
    endTimeToDate = endTime ? new Date(endTime) : undefined;
  } else {
    firstRevenue = await db.restaurant.findFirst();
    startTimeToDate = firstRevenue?.createdAt;
    endTimeToDate = new Date();
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
      db: db,
      model: 'revenue',
      mode: 'sum',
      field: 'totalSpent',
      startDate: startTimeToDate,
      endDate: endTimeToDate
    }),
    getCompare({
      db: db,
      model: 'user',
      mode: 'count',
      field: 'id',
      startDate: startTimeToDate,
      endDate: endTimeToDate
    }),
    getCompare({
      db: db,
      model: 'order',
      mode: 'count',
      field: 'id',
      startDate: startTimeToDate,
      endDate: endTimeToDate
    }),
    getCompare({
      db: db,
      model: 'product',
      mode: 'count',
      field: 'id',
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
        ? revenues.value.map((item: any) => {
            return {
              day: item.day,
              month: item.month,
              year: item.year,
              totalSpent: item._sum.totalSpent,
              totalOrders: item._sum.totalOrders,
              createdAt: firstRevenue?.updatedAt || new Date()
            };
          })
        : null,
    totalUsers:
      totalUsers.status === 'fulfilled' ? totalUsers.value : { currentValue: 0, previousValue: 0, changeRate: null },
    totalOrders:
      totalOrders.status === 'fulfilled' ? totalOrders.value : { currentValue: 0, previousValue: 0, changeRate: null },
    totalProducts:
      totalProducts.status === 'fulfilled'
        ? totalProducts.value
        : { currentValue: 0, previousValue: 0, changeRate: null },
    totalFinalRevenue:
      totalFinal.status === 'fulfilled' ? totalFinal.value : { currentValue: 0, previousValue: 0, changeRate: null },
    users: users.status === 'fulfilled' ? users.value : [],
    orders: orders.status === 'fulfilled' ? orders.value : []
  };
};
export const getOverviewDetail = async (db: PrismaClient, input: { startTime?: number; endTime?: number }) => {
  const { startTime, endTime } = input;
  let startTimeToDate, endTimeToDate;
  if (startTime && endTime) {
    startTimeToDate = startTime ? new Date(startTime) : undefined;
    endTimeToDate = endTime ? new Date(endTime) : undefined;
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

  //revenue by day

  let period = -1;
  let labels: string[] = [];

  if (startTime && endTime) {
    period = !(endTime - startTime) ? 1 : (endTime - startTime) / (24 * 60 * 60 * 1000) + 1;
    labels = Array.from({ length: +period }, (_, i) => {
      const currentDate = new Date(endTime - (period !== 1 ? (+period - i - 1) * 24 * 60 * 60 * 1000 : 0));
      return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    });
  }
  const summaryRevenue: Record<string, number> = {};
  labels.forEach(label => {
    summaryRevenue[label] = 0;
  });
  revenues.status === 'fulfilled' &&
    revenues.value.forEach((revenue: any) => {
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
      ? categories.value.reduce((acc: any, item: any) => {
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
        }, [])
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
        const user = userData.find((user: any) => user.id === item.userId);
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
