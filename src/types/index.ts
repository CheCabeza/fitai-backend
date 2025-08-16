import { users } from '@prisma/client';
import { Request, Response } from 'express';

// Extend the Prisma types with additional properties
export interface AuthenticatedUser extends users {
  // Add any additional properties needed for authenticated users
}

// Request with user property
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// AI response interface
export interface AIResponse {
  success: boolean;
  data: any;
  message?: string;
}

// Exercise interface
export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  caloriesPerMin?: number;
  description?: string;
  instructions: string[];
}

// Food item interface
export interface FoodItem {
  id: string;
  name: string;
  category?: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

// Meal plan interface (for AI generation)
export interface MealPlan {
  meals: any;
  totalCalories: number;
  recommendations?: string[];
}

// Workout plan interface (for AI generation)
export interface WorkoutPlan {
  exercises: any;
  duration: number;
  focus?: string;
  difficulty?: string;
  recommendations?: string[];
}

// User log interface
export interface UserLog {
  id: string;
  userId: string;
  date: Date;
  type: string;
  data: any;
  calories?: number;
}

// Fitness recommendations interface
export interface FitnessRecommendations {
  recommendations: string[];
  goal?: string;
  activityLevel?: string;
  estimatedCalories?: number;
}

// User registration data
export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  activityLevel?: string;
  restrictions?: string[];
}

// User login data
export interface UserLoginData {
  email: string;
  password: string;
}

// User profile update data
export interface UserProfileUpdateData {
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  activityLevel?: string;
  restrictions?: string[];
}

// Password change data
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// API response type
export type ApiResponseExpress = Response;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Environment variables
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  OPENAI_API_KEY?: string;
  REDIS_URL?: string;
  RATE_LIMIT_WINDOW_MS?: number;
  RATE_LIMIT_MAX_REQUESTS?: number;
}

// Validation error
export interface ValidationError {
  field: string;
  message: string;
  value: any;
}

// Constants
export const FITNESS_GOALS = {
  LOSE_WEIGHT: 'lose_weight',
  GAIN_MUSCLE: 'gain_muscle',
  MAINTAIN: 'maintain',
  FITNESS: 'fitness',
} as const;

export const ACTIVITY_LEVELS = {
  SEDENTARY: 'sedentary',
  LIGHT: 'light',
  MODERATE: 'moderate',
  VERY: 'very',
  EXTREME: 'extreme',
} as const;

export const LOG_TYPES = {
  FOOD: 'food',
  EXERCISE: 'exercise',
  WEIGHT: 'weight',
  MEASUREMENT: 'measurement',
} as const;

export const EXERCISE_CATEGORIES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FLEXIBILITY: 'flexibility',
  SPORTS: 'sports',
} as const;

export const WORKOUT_FOCUS = {
  FULL_BODY: 'full_body',
  UPPER_BODY: 'upper_body',
  LOWER_BODY: 'lower_body',
  CARDIO: 'cardio',
  STRENGTH: 'strength',
  FLEXIBILITY: 'flexibility',
} as const;
