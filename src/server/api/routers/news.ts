import Parser from 'rss-parser';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

const parser = new Parser();
const urlRss = 'https://vnexpress.net/rss/tin-moi-nhat.rss';

export const newsRouter = createTRPCRouter({
  fetchNews: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(), // Bỏ qua bao nhiêu bài
        take: z.number().positive(), // Lấy bao nhiêu bài
        query: z.string().optional() // Tìm kiếm nếu cần
      })
    )
    .query(async ({ input }) => {
      try {
        const { skip, take, query } = input;
        // Lấy dữ liệu RSS
        const feed: any = await parser.parseURL(urlRss);

        // Lọc dữ liệu nếu có query (tìm kiếm)
        const filteredItems = input?.query
          ? feed.items.filter((item: any) => item.title.toLowerCase().includes(query?.toLowerCase()))
          : feed.items;

        // Cắt mảng bài viết theo skip và take
        const pagedItems = filteredItems.slice(skip, skip + take);

        return {
          pagination: {
            totalPage: Math.ceil(filteredItems.length / take),
            currentPage: skip / take + 1
          },
          news: pagedItems.map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            description: item.contentSnippet || '',
            image: item.enclosure?.url || ''
          }))
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`RSS fetch failed: ${error.message}`);
        } else {
          throw new Error('RSS fetch failed: Unknown error');
        }
      }
    })
});
