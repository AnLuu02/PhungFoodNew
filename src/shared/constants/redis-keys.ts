export const PRODUCT_KEY = {
  all: ['all'],
  detail: (slug: string) => `product:${slug}`,
  full: (slug: string) => `product:full:${slug}`
};
