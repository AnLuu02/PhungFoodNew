import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { defaultProductFilters, productFilterSchema } from '~/shared/schema/product.filter.schema';
const parseSearchParams = (searchParams: URLSearchParams, isArrayKey?: string[]) => {
  const obj: Record<string, any> = {};

  searchParams.forEach((value, key) => {
    if (obj[key]) {
      obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value];
    } else {
      obj[key] = isArrayKey && isArrayKey.includes(key) ? [value] : value;
    }
  });

  return obj;
};

export const useProductFilters = () => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const raw = parseSearchParams(searchParams, ['sort', 'nguyen-lieu']);
    console.log(raw);

    const parsed = productFilterSchema.safeParse({
      ...defaultProductFilters,
      ...raw
    });

    if (!parsed.success) {
      return defaultProductFilters;
    }

    const data = parsed.data;

    return {
      page: data.page,
      limit: data.limit,

      sort: data.sort,

      'nguyen-lieu': data['nguyen-lieu'],

      ...(data.tag || data.s ? { s: data.tag || data.s } : {}),

      ...(data['danh-muc']
        ? {
            'danh-muc': data['danh-muc']
          }
        : {}),
      ...(data['loai-san-pham']
        ? {
            'loai-san-pham': data['loai-san-pham']
          }
        : {}),
      ...(data['loai']
        ? {
            loai: data['loai']
          }
        : {}),
      ...(data.minPrice || data.maxPrice
        ? {
            price: {
              min: data.minPrice,
              max: data.maxPrice
            }
          }
        : {}),
      ...(data.rating
        ? {
            rating: data.rating
          }
        : {})
    };
  }, [searchParams.toString()]);
};
