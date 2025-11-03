export const APP_CONFIG = {
  name: 'Mind Forge',
  description: 'AI-Powered Learning & Quiz Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://mindforge.app',
  
  limits: {
    fileUpload: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['.pdf', '.docx', '.txt'],
    },
    quiz: {
      maxQuestions: 20,
      minQuestions: 5,
      timeLimit: 60 * 60, // 1 hour in seconds
    },
  },
  
  features: {
    analytics: process.env.NODE_ENV === 'production',
    errorReporting: process.env.NODE_ENV === 'production',
    performanceMonitoring: true,
  },
} as const;

export const API_ENDPOINTS = {
  upload: '/api/upload',
  syllabi: '/api/syllabi',
  quiz: {
    generate: '/api/quiz/generate',
    get: (id: string) => `/api/quiz/${id}`,
    submit: (id: string) => `/api/quiz/${id}/submit`,
  },
  dashboard: '/api/dashboard/analytics',
  users: '/api/users',
} as const;

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  upload: '/test',
  quiz: (id?: string) => id ? `/quiz/${id}` : '/quiz',
  auth: {
    signIn: '/sign-in',
    signUp: '/sign-up',
  },
} as const;