import { User } from '@prisma/client';
import { Request, Response } from 'express';

// Extend Express Request to include user
export interface AuthenticatedRequest extends Request {
  user?: Partial<User>;
}

// User types
export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: 'lose_weight' | 'gain_muscle' | 'maintain' | 'fitness';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very' | 'extreme';
  restrictions?: string[];
}

export interface RegisterRequest extends AuthenticatedRequest {
  body: UserRegistrationData;
}

// Response tipado genérico para la API
export type ApiResponseExpress<T = any> = Response<ApiResponse<T>>;

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserProfileUpdateData {
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: 'lose_weight' | 'gain_muscle' | 'maintain' | 'fitness';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very' | 'extreme';
  restrictions?: string[];
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// AI types
export interface MealPlanRequest {
  date: string;
  preferences?: Record<string, any>;
  restrictions?: string[];
  targetCalories?: number;
}

export interface WorkoutPlanRequest {
  date: string;
  focus?: 'full_body' | 'upper_body' | 'lower_body' | 'cardio' | 'strength' | 'flexibility';
  duration?: number;
  equipment?: string[];
}

export interface UserLogData {
  type: 'food' | 'exercise' | 'weight' | 'measurement';
  data: Record<string, any>;
  calories?: number;
  date?: string;
}

// Food and Exercise types
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  category?: string;
  createdAt: Date;
}

export interface FoodItemBasic {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

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
  createdAt: Date;
}

// Meal Plan types
export interface Meal {
  name: string;
  foods: FoodItemBasic[];
  totalCalories: number;
}

export interface MealPlan {
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: FoodItemBasic[];
  };
  totalCalories: number;
  recommendations: string[];
}

// Workout Plan types
export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  rest: number;
  instructions: string[];
}

export interface WorkoutPlan {
  exercises: WorkoutExercise[];
  duration: number;
  focus: string;
  difficulty: string;
  recommendations: string[];
}

// Fitness Recommendations
export interface FitnessRecommendations {
  recommendations: string[];
  goal: string;
  activityLevel: string;
  estimatedCalories: number;
}

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

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
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
