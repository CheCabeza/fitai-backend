// FitAI System Constants

// Fitness goals
const FITNESS_GOALS = {
  LOSE_WEIGHT: 'lose_weight',
  GAIN_MUSCLE: 'gain_muscle',
  MAINTAIN: 'maintain',
  FITNESS: 'fitness',
};

// Activity levels
const ACTIVITY_LEVELS = {
  SEDENTARY: 'sedentary',
  LIGHT: 'light',
  MODERATE: 'moderate',
  VERY: 'very',
  EXTREME: 'extreme',
};

// Log types
const LOG_TYPES = {
  FOOD: 'food',
  EXERCISE: 'exercise',
  WEIGHT: 'weight',
  MEASUREMENT: 'measurement',
};

// Exercise categories
const EXERCISE_CATEGORIES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FLEXIBILITY: 'flexibility',
  SPORTS: 'sports',
};

// Muscle groups
const MUSCLE_GROUPS = {
  CHEST: 'chest',
  BACK: 'back',
  SHOULDERS: 'shoulders',
  ARMS: 'arms',
  LEGS: 'legs',
  CORE: 'core',
  FULL_BODY: 'full_body',
};

// Equipment
const EQUIPMENT = {
  BODYWEIGHT: 'bodyweight',
  DUMBBELL: 'dumbbell',
  BARBELL: 'barbell',
  MACHINE: 'machine',
  CABLE: 'cable',
  RESISTANCE_BAND: 'resistance_band',
};

// Difficulty levels
const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// Food categories
const FOOD_CATEGORIES = {
  PROTEIN: 'protein',
  CARB: 'carb',
  VEGETABLE: 'vegetable',
  FRUIT: 'fruit',
  FAT: 'fat',
  DAIRY: 'dairy',
  GRAIN: 'grain',
};

// Common dietary restrictions
const DIETARY_RESTRICTIONS = {
  VEGETARIAN: 'vegetarian',
  VEGAN: 'vegan',
  GLUTEN_FREE: 'gluten_free',
  DAIRY_FREE: 'dairy_free',
  NUT_FREE: 'nut_free',
  KETO: 'keto',
  PALEO: 'paleo',
};

// Pagination configuration
const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
};

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
};

// JWT configuration
const JWT_CONFIG = {
  SECRET: process.env['JWT_SECRET'] || 'your-secret-key',
  EXPIRES_IN: '7d',
  REFRESH_EXPIRES_IN: '30d',
};

// Database configuration
const DATABASE_CONFIG = {
  URL: process.env['DATABASE_URL'] || 'postgresql://user:password@localhost:5432/fitai',
  POOL_SIZE: 10,
  CONNECTION_TIMEOUT: 30000,
};

// AI configuration
const AI_CONFIG = {
  OPENAI_API_KEY: process.env['OPENAI_API_KEY'],
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
};

// Email configuration
const EMAIL_CONFIG = {
  FROM: process.env['EMAIL_FROM'] || 'noreply@fitai.com',
  SMTP_HOST: process.env['SMTP_HOST'] || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env['SMTP_PORT'] || '587'),
  SMTP_USER: process.env['SMTP_USER'],
  SMTP_PASS: process.env['SMTP_PASS'],
};

// File upload configuration
const UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  UPLOAD_DIR: 'uploads/',
};

// Validation rules
const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  AGE_MIN: 13,
  AGE_MAX: 120,
  WEIGHT_MIN: 30,
  WEIGHT_MAX: 300,
  HEIGHT_MIN: 100,
  HEIGHT_MAX: 250,
};

// Error messages
const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  CONFLICT: 'Conflict',
  TOO_MANY_REQUESTS: 'Too many requests',
};

// Success messages
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_SENT: 'Email sent successfully',
  FILE_UPLOADED: 'File uploaded successfully',
};

// API endpoints
const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  USERS: {
    BASE: '/api/users',
    LOGS: '/api/users/logs',
    MEAL_PLANS: '/api/users/meal-plans',
    WORKOUT_PLANS: '/api/users/workout-plans',
    STATISTICS: '/api/users/statistics',
  },
  AI: {
    BASE: '/api/ai',
    GENERATE_MEAL_PLAN: '/api/ai/generate-meal-plan',
    GENERATE_WORKOUT_PLAN: '/api/ai/generate-workout-plan',
    RECOMMENDATIONS: '/api/ai/recommendations',
    PROGRESS_ANALYSIS: '/api/ai/progress-analysis',
    EXERCISES: '/api/ai/exercises',
    FOODS: '/api/ai/foods',
  },
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Environment variables
const ENV = {
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  PORT: parseInt(process.env['PORT'] || '3001'),
  DATABASE_URL: process.env['DATABASE_URL'],
  JWT_SECRET: process.env['JWT_SECRET'],
  OPENAI_API_KEY: process.env['OPENAI_API_KEY'],
  REDIS_URL: process.env['REDIS_URL'],
  FRONTEND_URL: process.env['FRONTEND_URL'] || 'http://localhost:3000',
};

export {
    ACTIVITY_LEVELS, AI_CONFIG, API_ENDPOINTS, DATABASE_CONFIG, DIETARY_RESTRICTIONS, DIFFICULTY_LEVELS, EMAIL_CONFIG, ENV, EQUIPMENT, ERROR_MESSAGES, EXERCISE_CATEGORIES, FITNESS_GOALS, FOOD_CATEGORIES, HTTP_STATUS, JWT_CONFIG, LOG_TYPES, MUSCLE_GROUPS, PAGINATION,
    RATE_LIMIT, SUCCESS_MESSAGES, UPLOAD_CONFIG,
    VALIDATION_RULES
};

