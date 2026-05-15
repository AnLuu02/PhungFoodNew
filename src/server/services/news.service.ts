import { TRPCError } from '@trpc/server';
import Parser from 'rss-parser';

const parser = new Parser();
const urlRss = 'https://ngoisao.vnexpress.net/rss/am-thuc.rss';

export const fetchNewsService = async (input: { page: number; limit: number; s?: string }) => {
  try {
    const { page, limit, s } = input;
    const feed: any = await parser.parseURL(urlRss);

    const filteredItems = input?.s
      ? feed.items.filter((item: any) => item.title.toLowerCase().includes(s?.toLowerCase()))
      : feed.items;

    const start = (page - 1) * limit;
    const end = start + limit;
    const pagedItems = filteredItems.slice(start, end) ?? [];
    const totalPage = Math.ceil(filteredItems.length / limit);
    return {
      pagination: {
        totalPage: totalPage || 0,
        hasNextPage: Boolean(page < totalPage)
      },
      news: pagedItems.map((item: any) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.contentSnippet || '',
        image: item.enclosure?.url || '',
        categories: item.categories
      }))
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `RSS fetch failed: ${error.message}`
      });
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'RSS fetch failed: Unknown error'
      });
    }
  }
};
