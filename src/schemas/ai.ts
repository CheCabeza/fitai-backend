import { z } from 'zod';

// Zod schemas for structured generation
export const ExerciseSchema = z.object({
  name: z.string().describe('Exercise name'),
  description: z.string().describe('Brief description of the exercise'),
  muscle_group: z
    .enum(['chest', 'back', 'shoulders', 'arms', 'legs', 'core'])
    .describe('Primary muscle group targeted'),
  equipment: z
    .enum(['bodyweight', 'dumbbells', 'barbell', 'resistance_bands', 'kettlebell'])
    .describe('Equipment needed'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).describe('Difficulty level'),
  instructions: z.array(z.string()).describe('Step-by-step instructions'),
}) as any;

export const FoodSchema = z.object({
  name: z.string().describe('Food name'),
  calories: z.number().describe('Calories per serving'),
  protein: z.number().describe('Protein in grams'),
  carbs: z.number().describe('Carbohydrates in grams'),
  fats: z.number().describe('Fats in grams'),
  description: z.string().describe('Short description of the food'),
});

export type ExerciseData = z.infer<typeof ExerciseSchema>;
export type FoodData = z.infer<typeof FoodSchema>;
