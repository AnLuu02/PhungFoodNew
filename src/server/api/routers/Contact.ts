import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  deleteContactService,
  findContactService,
  getAllContactService,
  upsertContactService
} from '~/server/services/contact.service';
import { baseContactSchema } from '~/shared/schema/contact.schema';
export const contactRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await findContactService(ctx.db, input)),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteContactService(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => await getAllContactService(ctx.db)),
  upsert: publicProcedure
    .input(baseContactSchema)
    .mutation(async ({ ctx, input }) => await upsertContactService(ctx.db, input))
});
