import { MetadataRoute } from 'next';
import { generateSitemapUrls } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemapUrls().map(url => ({
    url: url.url,
    lastModified: new Date(url.lastModified),
    changeFrequency: url.changeFrequency as 'weekly' | 'monthly',
    priority: url.priority,
  }));
}