import { z } from 'zod';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const recentActivityRouter = createTRPCRouter({
  getRecentActivity: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      let startTimeToDate, endTimeToDate, firstRevenue: any;
      if (startTime && endTime) {
        startTimeToDate = startTime ? new Date(startTime) : undefined;
        endTimeToDate = endTime ? new Date(endTime) : undefined;
      } else {
        firstRevenue = await ctx.db.restaurant.findFirst();
        startTimeToDate = firstRevenue?.updatedAt;
        endTimeToDate = new Date();
      }
      const where = startTimeToDate &&
        endTimeToDate && {
          createdAt: {
            gte: startTimeToDate,
            lte: endTimeToDate
          }
        };
      const [users, orders, reviews] = await Promise.allSettled([
        ctx.db.user.findMany({
          where: {
            OR: [
              {
                createdAt: {
                  gte: startTimeToDate
                }
              },
              {
                updatedAt: {
                  gte: startTimeToDate
                }
              }
            ]
          },
          include: {
            image: true
          }
        }),
        ctx.db.order.findMany({
          where: {
            OR: [
              {
                createdAt: {
                  gte: startTimeToDate
                }
              },
              {
                updatedAt: {
                  gte: startTimeToDate
                }
              }
            ]
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }),
        ctx.db.review.findMany({
          where: {
            createdAt: {
              gte: startTimeToDate
            }
          },
          include: {
            product: {
              select: {
                name: true
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        })
      ]);

      let recentUsers: any = [];
      let recentOrders: any = [];
      let recentReviews: any = [];

      if (users?.status === 'fulfilled' && users.value.length > 0) {
        recentUsers = users.value.reduce((acc: any, user: any) => {
          const createdAt = new Date(user?.createdAt).getTime();
          const updatedAt = new Date(user?.updatedAt).getTime();

          if (createdAt !== updatedAt) {
            acc.push({
              id: user.id,
              image: user.image,
              actor: user.name,
              target: undefined,
              action: 'vừa cập nhật thông tin cá nhân',
              timezone: user?.updatedAt
            });
          } else {
            acc.push({
              id: user.id,
              image: user.image,
              actor: user.name,
              target: undefined,
              action: 'vừa tạo tài khoản',
              timezone: user?.createdAt
            });
          }
          return acc;
        }, []);
      }

      if (orders?.status === 'fulfilled' && orders.value.length > 0) {
        recentOrders = orders.value.reduce((acc: any, order: any) => {
          const createdAt = new Date(order?.createdAt).getTime();
          const updatedAt = new Date(order?.updatedAt).getTime();
          if (createdAt != updatedAt) {
            if (order?.status === LocalOrderStatus.COMPLETED) {
              acc.push({
                id: order.id,
                image: order?.user.image,
                actor: order?.user.name,
                target: order?.id,
                action: 'Vừa thanh toán thành công đơn hàng',
                timezone: order?.updatedAt
              });
            } else if (order?.status === LocalOrderStatus.CANCELLED) {
              acc.push({
                id: order.id,
                image: order?.user.image,
                actor: order?.user.name,
                target: order?.id,
                action: 'Vừa hủy đơn hàng',
                timezone: order?.updatedAt
              });
            }
          } else {
            if (order?.status === LocalOrderStatus.UNPAID) {
              acc.push({
                id: order.id,
                image: order?.user.image,
                actor: order?.user.name,
                target: order?.id,
                action: 'Vừa đặt hàng nhưng chưa thanh toán đơn hàng ',
                timezone: order?.createdAt
              });
            }
          }
          return acc;
        }, []);
      }

      if (reviews?.status === 'fulfilled' && reviews.value.length > 0) {
        recentReviews = reviews.value.reduce((acc: any, review: any) => {
          acc.push({
            id: review.id,
            image: review?.user.image,
            actor: review?.user.name,
            target: review?.product.name,
            action: 'Vừa đánh giá sản phẩm',
            timezone: review?.createdAt
          });
          return acc;
        }, []);
      }

      return [...recentUsers, ...recentOrders, ...recentReviews];
    }),
  getRecentActivityApp: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      let startTimeToDate, endTimeToDate, firstRevenue: any;
      if (startTime && endTime) {
        startTimeToDate = startTime ? new Date(startTime) : undefined;
        endTimeToDate = endTime ? new Date(endTime) : undefined;
      } else {
        firstRevenue = await ctx.db.restaurant.findFirst();
        startTimeToDate = firstRevenue?.updatedAt;
        endTimeToDate = new Date();
      }
      const where = startTimeToDate &&
        endTimeToDate && {
          OR: [
            {
              createdAt: {
                gte: startTimeToDate,
                lte: endTimeToDate
              }
            },
            {
              updatedAt: {
                gte: startTimeToDate,
                lte: endTimeToDate
              }
            }
          ]
        };
      const [products, restaurants, revenues] = await Promise.allSettled([
        ctx.db.product.findMany({
          where: where as any,
          include: {
            images: true,
            subCategory: true
          }
        }),
        ctx.db.restaurant.findMany({
          where: where as any,
          include: {
            logo: {
              select: {
                createdAt: true,
                updatedAt: true
              }
            },
            socials: {
              select: {
                createdAt: true,
                updatedAt: true
              }
            },
            theme: {
              select: {
                createdAt: true,
                updatedAt: true
              }
            },
            openingHours: {
              select: {
                createdAt: true,
                updatedAt: true
              }
            }
          }
        }),
        ctx.db.revenue.findMany({
          where: where as any
        })
      ]);

      let recentProducts: any = [];
      let recentRestaurants: any = [];
      let recentRevenues: any = [];

      if (products?.status === 'fulfilled' && products.value.length > 0) {
        recentProducts = products.value.reduce((acc: any, product: any) => {
          const createdAt = new Date(product?.createdAt).getTime();
          const updatedAt = new Date(product?.updatedAt).getTime();

          if (createdAt !== updatedAt) {
            acc.push({
              id: product.id,
              icon: 'product',
              actor: product.subCategory.name + ' ' + product.name,
              target: undefined,
              action: 'vừa được cập nhật thông tin',
              timezone: product?.updatedAt
            });
          } else {
            acc.push({
              id: product.id,
              icon: 'product',
              actor: product.subCategory.name + ' ' + product.name,
              target: undefined,
              action: 'đã được thêm vào hệ thống',
              timezone: product?.createdAt
            });
          }
          return acc;
        }, []);
      }

      if (restaurants?.status === 'fulfilled' && restaurants.value.length > 0) {
        recentRestaurants = restaurants.value.reduce((acc: any, restaurant: any) => {
          const createdAt = new Date(restaurant?.createdAt).getTime();
          const updatedAt = new Date(restaurant?.updatedAt).getTime();
          if (createdAt !== updatedAt) {
            acc.push({
              id: restaurant.id,
              icon: 'restaurant',
              actor: 'Nhà hàng' + ' ' + restaurant.name,
              target: undefined,
              action: 'đã được cập nhật thông tin',
              timezone: restaurant?.updatedAt
            });
          } else {
            acc.push({
              id: restaurant.id,
              icon: 'restaurant',
              actor: 'Nhà hàng ' + ' ' + restaurant.name,
              target: undefined,
              action: 'đã được thêm vào hệ thống',
              timezone: restaurant?.createdAt
            });
          }
          return acc;
        }, []);
      }

      const rangePointTotalSpent = [2000000, 5000000, 10000000, 25000000, 50000000, 100000000].reverse();

      if (revenues?.status === 'fulfilled' && revenues.value.length > 0) {
        const totalSpent = revenues.value.reduce((acc: any, revenue: any) => {
          acc += Number(revenue.totalSpent);
          return acc;
        }, 0);
        for (let i = 0; i < rangePointTotalSpent.length; i++) {
          const item = rangePointTotalSpent[i]!;
          if (totalSpent >= item) {
            recentRevenues.push({
              id: `revenue_${item}`,
              icon: 'revenue',
              actor: 'Nhà hàng ' + ' ' + firstRevenue?.name,
              target: undefined,
              action:
                'Vừa đạt mốc doanh thu ' +
                formatPriceLocaleVi(item) +
                ' vào lúc ' +
                formatDateViVN(revenues.value[0]?.createdAt, {
                  hour: true
                }),
              timezone: revenues.value[revenues.value.length - 1]?.createdAt
            });
            break;
          }
        }
      }

      return [...recentProducts, ...recentRestaurants, ...recentRevenues];
    })
});
