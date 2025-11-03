import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mindforge.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard',
        '/quiz/',
        '/test',
        '/sign-in',
        '/sign-up',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}