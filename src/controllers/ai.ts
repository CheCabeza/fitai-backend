import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { ApiResponseExpress, AuthenticatedRequest } from '../types';
import { generateMealPlan, generateWorkoutPlan } from '../utils/ai';

const prisma = new PrismaClient();

// Generate nutritional plan
const createMealPlan = async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    const { id } = req.user;
    const { date } = req.body;

    // Get user data
    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Generate plan with AI
    const mealPlan = await generateMealPlan({
      user,
      date: new Date(date),
      preferences: {},
      restrictions: [],
      targetCalories: 2000,
    });

    // Save plan to database
    const savedPlan = await prisma.meal_plans.create({
      data: {
        id: crypto.randomUUID(),
        userId: id,
        date: new Date(date),
        meals: JSON.stringify(mealPlan.meals),
        totalCalories: mealPlan.totalCalories,
      },
    });

    res.json({
      success: true,
      message: 'Nutritional plan generated successfully',
      data: savedPlan,
    });
  } catch (error) {
    console.error('Error generating nutritional plan:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Generate workout plan
const createWorkoutPlan = async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    const { id } = req.user;
    const { date } = req.body;

    // Get user data
    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Generate plan with AI
    const workoutPlan = await generateWorkoutPlan({
      user,
      date: new Date(date),
      focus: 'full_body',
      duration: 45,
      equipment: ['bodyweight'],
    });

    // Save plan to database
    const savedPlan = await prisma.workout_plans.create({
      data: {
        id: crypto.randomUUID(),
        userId: id,
        date: new Date(date),
        exercises: JSON.stringify(workoutPlan.exercises),
        duration: workoutPlan.duration || null,
      },
    });

    res.json({
      success: true,
      message: 'Workout plan generated successfully',
      data: savedPlan,
    });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export {
  createMealPlan,
  createWorkoutPlan
};

