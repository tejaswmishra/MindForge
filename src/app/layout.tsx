import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { generateMetadata as generateSEOMetadata, generateStructuredData } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

// Enhanced metadata with SEO optimization
export const metadata: Metadata = {
  ...generateSEOMetadata(),
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
}

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
        <head>
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateStructuredData())
            }}
          />
          
          {/* Preload critical resources */}
          <link 
            rel="preload" 
            href="/fonts/inter-var.woff2" 
            as="font" 
            type="font/woff2" 
            crossOrigin="anonymous" 
          />
          
          {/* DNS prefetch for external services */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//api.clerk.dev" />
          
          {/* Security headers */}
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
          
          {/* Performance hints */}
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          
          {/* Initialize performance tracking */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  // Track page load performance
                  window.addEventListener('load', function() {
                    const loadTime = performance.now();
                    console.log('Page load time:', loadTime + 'ms');
                    
                    // Track Core Web Vitals
                    if ('PerformanceObserver' in window) {
                      // LCP
                      new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        console.log('LCP:', lastEntry.startTime);
                      }).observe({ type: 'largest-contentful-paint', buffered: true });
                      
                      // FID
                      new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach((entry) => {
                          console.log('FID:', entry.processingStart - entry.startTime);
                        });
                      }).observe({ type: 'first-input', buffered: true });
                    }
                  });
                }
              `
            }}
          />
        </head>
        
        <body className="min-h-screen bg-background font-sans antialiased">
          <ErrorBoundary>
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1">
                {children}
              </main>
            </div>
          </ErrorBoundary>
          
          {/* Performance monitoring script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Resource loading performance
                window.addEventListener('load', function() {
                  if (navigator.sendBeacon) {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Navigation timing:', {
                      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
                      tcp: perfData.connectEnd - perfData.connectStart,
                      request: perfData.responseStart - perfData.requestStart,
                      response: perfData.responseEnd - perfData.responseStart,
                      dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                      load: perfData.loadEventEnd - perfData.loadEventStart
                    });
                  }
                });
              `
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}