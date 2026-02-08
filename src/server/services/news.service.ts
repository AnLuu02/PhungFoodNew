import Parser from 'rss-parser';
const parser = new Parser();
const urlRss = 'https://ngoisao.vnexpress.net/rss/am-thuc.rss';

export async function fetchNews(input: { skip: number; take: number; s?: string }) {
  try {
    const { skip, take, s } = input;
    const feed: any = await parser.parseURL(urlRss);

    const filteredItems = input?.s
      ? feed.items.filter((item: any) => item.title.toLowerCase().includes(s?.toLowerCase()))
      : feed.items;

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
        image: item.enclosure?.url || '',
        categories: item.categories
      }))
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`RSS fetch failed: ${error.message}`);
    } else {
      throw new Error('RSS fetch failed: Unknown error');
    }
  }
}
