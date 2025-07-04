import { MetadataRoute } from 'next';
import { api } from '~/trpc/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DEPLOY || 'http://localhost:3000';

  const staticRoutes = [
    '/',
    '/gioi-thieu',
    '/san-pham',
    '/thuc-don',
    '/tin-tuc',
    '/lien-he',
    '/khuyen-mai',
    '/goi-mon-nhanh',
    '/chinh-sach',
    '/don-hang-cua-toi',
    '/gio-hang',
    '/thanh-toan',
    '/thong-tin',
    '/yeu-thich'
  ];

  const products = await api.Product.getAll({});

  const productRoutes = products.map(product => ({
    url: `${baseUrl}/san-pham/${product.tag}`,
    lastModified: new Date().toISOString()
  }));

  const staticEntries = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  return [...staticEntries, ...productRoutes];
}
