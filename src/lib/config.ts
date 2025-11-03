interface Config {
  app: {
    name: string;
    url: string;
    description: string;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    analytics: boolean;
    errorReporting: boolean;
    performanceMonitoring: boolean;
  };
  limits: {
    fileUploadSize: number;
    maxQuestionsPerQuiz: number;
    apiRateLimit: number;
  };
}

const config: Config = {
  app: {
    name: 'Mind Forge',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://mindforge.app',
    description: 'AI-Powered Learning & Quiz Platform'
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10)
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    errorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
    performanceMonitoring: process.env.NODE_ENV === 'production'
  },
  limits: {
    fileUploadSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    maxQuestionsPerQuiz: parseInt(process.env.MAX_QUIZ_QUESTIONS || '20', 10),
    apiRateLimit: parseInt(process.env.API_RATE_LIMIT || '100', 10)
  }
};

export default config;