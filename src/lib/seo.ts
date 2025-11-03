// lib/seo.ts
import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const defaultSEO: Required<Omit<SEOProps, 'noIndex'>> = {
  title: 'Mind Forge - AI-Powered Learning & Quiz Platform',
  description: 'Transform your study materials into personalized AI-generated quizzes. Upload PDFs, Word documents, or text files and get intelligent assessments with detailed analytics.',
  keywords: [
    'AI learning',
    'quiz generator',
    'study tool',
    'educational platform',
    'personalized learning',
    'AI tutoring',
    'study materials',
    'quiz platform',
    'learning analytics',
    'educational AI'
  ],
  image: '/og-image.png',
  url: 'https://mindforge.app',
  type: 'website'
};

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  noIndex = false
}: SEOProps = {}): Metadata {
  const finalTitle = title 
    ? `${title} | Mind Forge`
    : defaultSEO.title;
  
  const finalDescription = description || defaultSEO.description;
  const finalKeywords = [...defaultSEO.keywords, ...keywords];
  const finalImage = image || defaultSEO.image;
  const finalUrl = url || defaultSEO.url;

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords.join(', '),
    
    // OpenGraph
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: finalUrl,
      siteName: 'Mind Forge',
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      locale: 'en_US',
      type: type,
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
      creator: '@mindforge',
    },
    
    // Additional meta tags
    robots: noIndex 
      ? 'noindex, nofollow' 
      : 'index, follow',
    
    // Verification and other meta
    verification: {
      google: 'your-google-verification-code',
    },
    
    // Additional metadata
    applicationName: 'Mind Forge',
    authors: [{ name: 'Mind Forge Team' }],
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    
    // Icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    
    // Manifest
    manifest: '/site.webmanifest',
  };
}

// Page-specific metadata generators
export const pageMetadata = {
  home: () => generateMetadata({
    title: 'AI-Powered Learning Platform',
    description: 'Transform your study materials into personalized AI-generated quizzes. Upload PDFs, Word documents, or text files and get intelligent assessments with detailed analytics.',
    keywords: ['AI learning platform', 'personalized quizzes', 'study tool']
  }),
  
  dashboard: () => generateMetadata({
    title: 'Dashboard',
    description: 'Track your learning progress with detailed analytics, performance metrics, and personalized insights.',
    keywords: ['learning dashboard', 'progress tracking', 'analytics'],
    noIndex: true // Private page
  }),
  
  upload: () => generateMetadata({
    title: 'Upload & Generate Quizzes',
    description: 'Upload your course materials and let our AI create personalized quizzes instantly. Supports PDF, Word, and text files.',
    keywords: ['upload study materials', 'AI quiz generation', 'file upload'],
    noIndex: true // Private page
  }),
  
  quiz: (quizTitle?: string) => generateMetadata({
    title: quizTitle ? `Quiz: ${quizTitle}` : 'Take Quiz',
    description: 'Take your personalized AI-generated quiz with instant feedback and detailed explanations.',
    keywords: ['online quiz', 'AI assessment', 'learning quiz'],
    noIndex: true // Private page
  }),
  
  auth: (type: 'signin' | 'signup') => generateMetadata({
    title: type === 'signin' ? 'Sign In' : 'Sign Up',
    description: type === 'signin' 
      ? 'Sign in to your Mind Forge account to continue your learning journey.'
      : 'Create your Mind Forge account and start generating AI-powered quizzes today.',
    keywords: type === 'signin' 
      ? ['sign in', 'login', 'account access']
      : ['sign up', 'register', 'create account', 'get started']
  })
};

// JSON-LD structured data
export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://mindforge.app/#website',
        url: 'https://mindforge.app',
        name: 'Mind Forge',
        description: 'AI-Powered Learning & Quiz Platform',
        publisher: {
          '@type': 'Organization',
          name: 'Mind Forge',
          url: 'https://mindforge.app',
          logo: {
            '@type': 'ImageObject',
            url: 'https://mindforge.app/logo.png'
          }
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://mindforge.app/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Mind Forge',
        description: 'Transform your study materials into personalized AI-generated quizzes',
        url: 'https://mindforge.app',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        author: {
          '@type': 'Organization',
          name: 'Mind Forge Team'
        },
        features: [
          'AI-powered quiz generation',
          'Multi-format file support',
          'Real-time analytics',
          'Personalized learning paths'
        ]
      }
    ]
  };
}

// Performance monitoring utilities
export const performanceMetrics = {
  // Core Web Vitals tracking
  trackWebVitals: () => {
    if (typeof window === 'undefined') return;
    
    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
      // Send to analytics service
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    
    
  new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry: any) => {
    if (entry.processingStart !== undefined) {
      console.log('FID:', entry.processingStart - entry.startTime);
      
    }
  });
}).observe({ type: 'first-input', buffered: true });
  },
  
  // Custom performance tracking
  trackCustomMetric: (name: string, value: number) => {
    console.log(`Custom metric ${name}:`, value);
    // Send to analytics service
    
    // Also track in Performance API
    performance.mark(`custom-${name}`);
  },
  
  // Page load time tracking
  trackPageLoad: (pageName: string) => {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page ${pageName} load time:`, loadTime);
      // Send to analytics service
    });
  }
};

// Sitemap generator utility
export function generateSitemapUrls() {
  const baseUrl = 'https://mindforge.app';
  const currentDate = new Date().toISOString().split('T')[0];
  
  return [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6
    }
  ];
}