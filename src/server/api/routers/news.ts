import { z } from 'zod';
import { fetchNewsService } from '~/server/services/news.service';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const newsRouter = createTRPCRouter({
  fetchNews: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ input }) => await fetchNewsService(input))
});
