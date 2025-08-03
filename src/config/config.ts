import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env') });

export interface Config {
  baseUrl: string;
  timeout: number;
  logLevel: string;
  logToFile: boolean;
  logFilePath: string;
  parallel: number;
  retryCount: number;
  tags: string;
  generateHtmlReport: boolean;
  generateJsonReport: boolean;
  reportTitle: string;
  reportTheme: string;
  performanceTimeout: number;
  concurrentRequests: number;
  loadTestDuration: number;
  enableScreenshots: boolean;
  enableVideos: boolean;
  enableTraces: boolean;
  ci: boolean;
  githubActions: boolean;
  apiKey?: string;
  authToken?: string;
  testUserId: number;
  testPostId: number;
  testCommentId: number;
  healthCheckTimeout: number;
  healthCheckRetries: number;
}

const getConfig = (): Config => {
  return {
    // Base configuration
    baseUrl: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    logLevel: process.env.LOG_LEVEL || 'info',
    logToFile: process.env.LOG_TO_FILE === 'true',
    logFilePath: process.env.LOG_FILE_PATH || 'logs/test.log',

    // Test execution
    parallel: parseInt(process.env.PARALLEL || '2'),
    retryCount: parseInt(process.env.RETRY_COUNT || '1'),
    tags: process.env.TAGS || '@smoke',

    // Reports
    generateHtmlReport: process.env.GENERATE_HTML_REPORT !== 'false',
    generateJsonReport: process.env.GENERATE_JSON_REPORT !== 'false',
    reportTitle: process.env.REPORT_TITLE || 'JSONPlaceholder API Tests',
    reportTheme: process.env.REPORT_THEME || 'bootstrap',

    // Performance
    performanceTimeout: parseInt(process.env.PERFORMANCE_TIMEOUT || '5000'),
    concurrentRequests: parseInt(process.env.CONCURRENT_REQUESTS || '5'),
    loadTestDuration: parseInt(process.env.LOAD_TEST_DURATION || '30'),

    // Feature flags
    enableScreenshots: process.env.ENABLE_SCREENSHOTS === 'true',
    enableVideos: process.env.ENABLE_VIDEOS === 'true',
    enableTraces: process.env.ENABLE_TRACES === 'true',

    // CI/CD
    ci: process.env.CI === 'true',
    githubActions: process.env.GITHUB_ACTIONS === 'true',

    // Security
    apiKey: process.env.API_KEY,
    authToken: process.env.AUTH_TOKEN,

    // Test data
    testUserId: parseInt(process.env.TEST_USER_ID || '1'),
    testPostId: parseInt(process.env.TEST_POST_ID || '1'),
    testCommentId: parseInt(process.env.TEST_COMMENT_ID || '1'),

    // Health check
    healthCheckTimeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '10000'),
    healthCheckRetries: parseInt(process.env.HEALTH_CHECK_RETRIES || '3')
  };
};

export const CONFIG = getConfig();

// Validation
export const validateConfig = (): void => {
  const errors: string[] = [];

  if (!CONFIG.baseUrl) {
    errors.push('BASE_URL is required');
  }

  if (CONFIG.timeout < 1000) {
    errors.push('TIMEOUT must be at least 1000ms');
  }

  if (CONFIG.parallel < 1) {
    errors.push('PARALLEL must be at least 1');
  }

  if (CONFIG.retryCount < 0) {
    errors.push('RETRY_COUNT must be 0 or greater');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
};

// Environment helpers
export const isProduction = (): boolean => process.env.NODE_ENV === 'production';
export const isTest = (): boolean => process.env.NODE_ENV === 'test';
export const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';
export const isCI = (): boolean => CONFIG.ci || CONFIG.githubActions;

// Export for convenience
export default CONFIG;
