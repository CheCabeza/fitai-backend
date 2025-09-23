import { Request } from 'express';

// Global interfaces for the application
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    id: string;
    email: string;
  };
}

export interface ApiResponseExpress {
  status: (code: number) => ApiResponseExpress;
  json: (data: any) => void;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface UserLoginData {
  email: string;
  password: string;
}

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

export interface UserProfileUpdateData {
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  activityLevel?: string;
  restrictions?: string[];
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface FitnessRecommendations {
  general: string[];
  nutrition: string[];
  exercise: string[];
  lifestyle: string[];
  recommendations: string[];
  goal?: string;
  activityLevel?: string;
  estimatedCalories?: number;
}

export interface MealPlan {
  meals: {
    breakfast: any;
    lunch: any;
    dinner: any;
    snacks: any;
  };
  totalCalories: number;
  recommendations: string[];
}

export interface WorkoutPlan {
  exercises: any[];
  duration: number;
  focus: string;
  difficulty: string;
  recommendations: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  activityLevel?: string;
  restrictions?: string[];
}
