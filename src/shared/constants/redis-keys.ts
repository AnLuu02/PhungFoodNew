export const THEME_KEY = {
  default: `theme:default`
};

export const RESTAURANT_KEY = {
  active: 'restaurant:active',
  full: `restaurant:full:active`
};

export const PRODUCT_KEY = {
  all: ['all'],
  detail: (slug: string) => `product:${slug}`,
  full: (slug: string) => `product:full:${slug}`
};

export const CATEGORY_KEY = {
  one: `category:base:one`,
  withRelationBase: `category:all:withRelationBase`,
  only: `category:all:only`
};
export const SUBCATEGORY_KEY = {
  one: `subCategory:base:one`,
  withRelationBase: `subCategory:all:withRelationBase`,
  only: `subCategory:all:only`
};
