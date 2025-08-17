import { config } from 'dotenv';
import path from 'path';

// Load the correct .env file based on environment
const env = process.env['NODE_ENV'] || 'development';
const envFile = `.env.${env}`;

// Load environment variables
config({ path: path.resolve(process.cwd(), envFile) });

// If the specific file doesn't exist, load default .env
if (!process.env['DATABASE_URL']) {
  config({ path: path.resolve(process.cwd(), '.env') });
}

export const ENV_CONFIG = {
  // Environment
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  
  // Database
  DATABASE_URL: process.env['DATABASE_URL'] || '',
  
  // JWT
  JWT_SECRET: process.env['JWT_SECRET'] || 'default-secret-key',
  
  // URLs
  FRONTEND_URL: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  
  // OpenAI
  OPENAI_API_KEY: process.env['OPENAI_API_KEY'] || '',
  
  // Port
  PORT: parseInt(process.env['PORT'] || '3001', 10),
  
  // Supabase
  SUPABASE_URL: process.env['SUPABASE_URL'] || '',
  SUPABASE_ANON_KEY: process.env['SUPABASE_ANON_KEY'] || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env['SUPABASE_SERVICE_ROLE_KEY'] || '',
  
  // Logging
  LOG_LEVEL: process.env['LOG_LEVEL'] || 'info',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10),
  
  // Test
  TEST_TIMEOUT: parseInt(process.env['TEST_TIMEOUT'] || '10000', 10),
};

// Validate required configuration
export const validateConfig = () => {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !ENV_CONFIG[key as keyof typeof ENV_CONFIG]);
  
  // Check if we have either DATABASE_URL or Supabase configuration
  const hasDatabaseUrl = !!ENV_CONFIG.DATABASE_URL;
  const hasSupabaseConfig = !!(ENV_CONFIG.SUPABASE_URL && ENV_CONFIG.SUPABASE_SERVICE_ROLE_KEY);
  
  if (!hasDatabaseUrl && !hasSupabaseConfig) {
    throw new Error(
      'Missing database configuration: Either DATABASE_URL or Supabase configuration (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) is required',
    );
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (ENV_CONFIG.NODE_ENV === 'production' && !ENV_CONFIG.OPENAI_API_KEY) {
    console.warn('⚠️  Warning: OPENAI_API_KEY not set in production');
  }
};

// Function to get configuration based on environment
export const getConfig = () => {
  validateConfig();
  return ENV_CONFIG;
};

// Function to check if we are in development
export const isDevelopment = () => ENV_CONFIG.NODE_ENV === 'development';

// Function to check if we are in production
export const isProduction = () => ENV_CONFIG.NODE_ENV === 'production';

// Function to check if we are in test
export const isTest = () => ENV_CONFIG.NODE_ENV === 'test';

export default ENV_CONFIG;
