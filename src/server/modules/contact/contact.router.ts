import { z } from 'zod';
import { activityLogger, createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { baseContactSchema } from '~/shared/schema/contact.schema';
import { deleteContactService, findContactService, upsertContactService } from './contact.service';

const adminContactRouter = createTRPCRouter({
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const [total, byType] = await ctx.db.$transaction([
      ctx.db.contact.count({}),
      ctx.db.contact.groupBy({
        by: ['type'],
        orderBy: { type: 'asc' },
        _count: { _all: true }
      })
    ]);
    return {
      total,
      byType: byType.map(bt => ({
        type: bt.type,
        count: bt._count && typeof bt._count === 'object' ? (bt._count?._all ?? 0) : 0
      }))
    };
  })
});
export const contactRouter = createTRPCRouter({
  admin: adminContactRouter,

  find: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(5),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await findContactService(ctx.db, input)),

  delete: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteContactService(ctx.db, input)),
  upsert: publicProcedure
    .use(activityLogger)
    .input(baseContactSchema)
    .mutation(async ({ ctx, input }) => await upsertContactService(ctx.db, input))
});
