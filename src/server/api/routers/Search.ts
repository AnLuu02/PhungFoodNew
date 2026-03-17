import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { searchGlobalService, searchService } from '~/server/services/search.service';

export const searchRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await searchService(ctx.db, input)),
  searchGlobal: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await searchGlobalService(ctx.db, input))
});
