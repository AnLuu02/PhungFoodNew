import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api', '/admin']
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/sitemap.xml`
  };
}
