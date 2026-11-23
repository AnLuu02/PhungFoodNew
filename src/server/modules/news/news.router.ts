import { z } from 'zod';
import { fetchNewsService } from './news.service';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const newsRouter = createTRPCRouter({
  fetchNews: publicProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
        s: z.string().optional()
      })
    )
    .query(async ({ input }) => await fetchNewsService(input))
});
