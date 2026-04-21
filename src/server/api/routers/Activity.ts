import { z } from 'zod';
import { db } from '~/server/db';
import { getAllActivitiesService } from '~/server/services/activityLogger.service';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const CURSOR_LIMIT = 20;

export const activityRouter = createTRPCRouter({
  feed: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(5).max(50).default(CURSOR_LIMIT),
        filters: z
          .object({
            entityType: z.string().optional(),
            action: z.string().optional(),
            userId: z.string().optional(),
            dateFrom: z.date().optional(),
            dateTo: z.date().optional(),
            search: z.string().optional()
          })
          .optional()
      })
    )
    .query(async ({ ctx, input }) => await getAllActivitiesService(ctx.db, input)),

  bulkDelete: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()).default([])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;
      return await ctx.db.activityLog.deleteMany({
        where: {
          id: {
            in: ids
          }
        }
      });
    }),

  stats: protectedProcedure
    .input(
      z.object({
        dateRange: z.enum(['today', 'week', 'month']).default('week')
      })
    )
    .query(async ({ input }) => {
      const now = new Date();
      let dateFrom = new Date();

      switch (input.dateRange) {
        case 'today':
          dateFrom.setHours(0, 0, 0, 0);
          break;
        case 'week':
          dateFrom.setDate(dateFrom.getDate() - 7);
          break;
        case 'month':
          dateFrom.setMonth(dateFrom.getMonth() - 1);
          break;
      }

      const total = await db.activityLog.count({
        where: { createdAt: { gte: dateFrom } }
      });

      const byAction = await db.activityLog.groupBy({
        by: ['action'],
        where: { createdAt: { gte: dateFrom } },
        _count: true,
        orderBy: { _count: { action: 'desc' } },
        take: 5
      });

      const byEntity = await db.activityLog.groupBy({
        by: ['entityType'],
        where: { createdAt: { gte: dateFrom } },
        _count: true,
        orderBy: { _count: { entityType: 'desc' } }
      });

      const topEditors = await db.activityLog.groupBy({
        by: ['userId'],
        where: { createdAt: { gte: dateFrom } },
        _count: true,
        orderBy: { _count: { userId: 'desc' } },
        take: 10
      });

      const editors = await db.user.findMany({
        where: {
          id: { in: topEditors.map(e => e.userId) }
        },
        select: { id: true, name: true, email: true }
      });

      return {
        total,
        byAction,
        byEntity,
        topEditors: topEditors.map(te => ({
          ...editors.find(e => e.id === te.userId),
          count: te._count
        }))
      };
    }),

  timeline: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(30).default(7)
      })
    )
    .query(async ({ input }) => {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - input.days);

      const logs = await db.activityLog.findMany({
        where: { createdAt: { gte: dateFrom } },
        select: { createdAt: true, action: true },
        orderBy: { createdAt: 'desc' }
      });

      const timeline: Record<string, number> = {};
      logs.forEach(log => {
        const hour = new Date(log.createdAt);
        hour.setMinutes(0, 0, 0);
        const key = hour.toISOString();
        timeline[key] = (timeline[key] || 0) + 1;
      });

      return Object.entries(timeline)
        .map(([time, count]) => ({
          time: new Date(time),
          count
        }))
        .sort((a, b) => a.time.getTime() - b.time.getTime());
    })
});
