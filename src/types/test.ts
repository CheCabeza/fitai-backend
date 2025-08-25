// Type definitions for test data
export type ValidGoal = 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_fitness';
export type ValidActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export interface TestUserData {
  email: string;
  password: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: ValidGoal;
  activityLevel?: ValidActivityLevel;
  restrictions?: string[];
}
