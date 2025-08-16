import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { ApiResponseExpress, AuthenticatedRequest } from '../types';
import {
  generateMealPlan,
  generateWorkoutPlan,
  getFitnessRecommendations,
} from '../utils/ai';

export const aiRoutes = express.Router();
const prisma = new PrismaClient();

// Generate personalized meal plan
aiRoutes.post('/generate-meal-plan', authenticateToken, async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
  try {
    const { date, preferences, restrictions, targetCalories } = req.body;

    if (!date) {
      res.status(400).json({ success: false, error: 'Date is required' });
      return;
    }

    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    // Get user data for personalization
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        age: true,
        weight: true,
        height: true,
        goal: true,
        activityLevel: true,
        restrictions: true,
      },
    });

    // Generate meal plan using AI
    const mealPlan = await generateMealPlan({
      user,
      date: new Date(date),
      preferences: preferences || {},
      restrictions: restrictions || user?.restrictions || [],
      targetCalories: targetCalories || 2000,
    });

    // Save to database
    const savedMealPlan = await prisma.meal_plans.create({
      data: {
        id: crypto.randomUUID(),
        userId: req.user.id,
        date: new Date(date),
        meals: JSON.stringify(mealPlan.meals),
        totalCalories: mealPlan.totalCalories,
      },
    });

    res.json({
      success: true,
      message: 'Meal plan generated successfully',
      data: {
        ...savedMealPlan,
        aiGenerated: true,
        recommendations: (mealPlan as any).recommendations || [],
      },
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ success: false, error: 'Error generating meal plan' });
  }
});

// Generate personalized workout plan
aiRoutes.post('/generate-workout-plan', authenticateToken, async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
  try {
    const { date, focus, duration, equipment } = req.body;

    if (!date) {
      res.status(400).json({ success: false, error: 'Date is required' });
      return;
    }

    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    // Get user data for personalization
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        age: true,
        weight: true,
        height: true,
        goal: true,
        activityLevel: true,
      },
    });

    // Generate workout plan using AI
    const workoutPlan = await generateWorkoutPlan({
      user,
      date: new Date(date),
      focus: focus || 'full_body',
      duration: duration || 45,
      equipment: equipment || ['bodyweight'],
    });

    // Save to database
    const savedWorkoutPlan = await prisma.workout_plans.create({
      data: {
        id: crypto.randomUUID(),
        userId: req.user.id,
        date: new Date(date),
        exercises: JSON.stringify(workoutPlan.exercises),
        duration: workoutPlan.duration || null,
      },
    });

    res.json({
      success: true,
      message: 'Workout plan generated successfully',
      data: {
        ...savedWorkoutPlan,
        aiGenerated: true,
        recommendations: (workoutPlan as any).recommendations || [],
      },
    });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({ success: false, error: 'Error generating workout plan' });
  }
});

// Get fitness recommendations
aiRoutes.get('/recommendations', optionalAuth, async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
  try {
    const { goal, activityLevel, age, weight, height } = req.query;

    let userData: any = {};

    if (req.user?.id) {
      // If user is authenticated, use their data
      const user = await prisma.users.findUnique({
        where: { id: req.user.id },
        select: {
          age: true,
          weight: true,
          height: true,
          goal: true,
          activityLevel: true,
        },
      });
      userData = user;
    } else {
      // If no user, use query params data
      userData = {
        goal: goal || 'fitness',
        activityLevel: activityLevel || 'moderate',
        age: age ? parseInt(age as string) : null,
        weight: weight ? parseFloat(weight as string) : null,
        height: height ? parseFloat(height as string) : null,
      };
    }

    const recommendations = await getFitnessRecommendations(userData);

    res.json({
      success: true,
      data: {
        recommendations,
        userData,
      },
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ success: false, error: 'Error getting recommendations' });
  }
});

// Analyze user progress
aiRoutes.get('/progress-analysis', authenticateToken, async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    const where: any = {
      userId: req.user.id,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    // Get logs from the period
    const logs = await prisma.user_logs.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    // Get meal and workout plans
    const mealPlans = await prisma.meal_plans.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    const workoutPlans = await prisma.workout_plans.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    // Analyze progress
    const analysis: any = {
      period: {
        start: startDate || 'beginning',
        end: endDate || 'current',
      },
      summary: {
        totalLogs: logs.length,
        totalMealPlans: mealPlans.length,
        totalWorkoutPlans: workoutPlans.length,
        averageCaloriesPerDay: 0,
        consistencyScore: 0,
      },
      trends: {
        weight: [],
        calories: [],
        exercise: [],
      },
      recommendations: [] as string[],
    };

    // Calculate metrics
    if (logs.length > 0) {
      const foodLogs = logs.filter((log: any) => log.type === 'food');
      const exerciseLogs = logs.filter((log: any) => log.type === 'exercise');
      const weightLogs = logs.filter((log: any) => log.type === 'weight');

      // Calculate average calories per day
      const totalCalories = foodLogs.reduce(
        (sum: number, log: any) => sum + (log.calories || 0),
        0,
      );
      const daysWithFood = new Set(
        foodLogs.map((log: any) => log.date.toDateString()),
      ).size;
      analysis.summary.averageCaloriesPerDay =
        daysWithFood > 0 ? Math.round(totalCalories / daysWithFood) : 0;

      // Calculate consistency score
      const totalDays = new Set(logs.map((log: any) => log.date.toDateString()))
        .size;
      const daysWithActivity = new Set([
        ...foodLogs.map((log: any) => log.date.toDateString()),
        ...exerciseLogs.map((log: any) => log.date.toDateString()),
      ]).size;
      analysis.summary.consistencyScore =
        totalDays > 0 ? Math.round((daysWithActivity / totalDays) * 100) : 0;

      // Weight trends
      analysis.trends.weight = weightLogs.map((log: any) => ({
        date: log.date,
        weight: log.data.weight || log.data.value,
      }));

      // Calorie trends
      analysis.trends.calories = foodLogs.map((log: any) => ({
        date: log.date,
        calories: log.calories,
      }));
    }

    // Generate recommendations based on analysis
    if (analysis.summary.consistencyScore < 70) {
      analysis.recommendations.push(
        'Try to be more consistent with your daily logging',
      );
    }

    if (analysis.summary.averageCaloriesPerDay < 1200) {
      analysis.recommendations.push('Consider increasing your caloric intake');
    }

    if (analysis.summary.averageCaloriesPerDay > 3000) {
      analysis.recommendations.push('Consider reducing your caloric intake');
    }

    res.json({ success: true, data: { analysis } });
  } catch (error) {
    console.error('Error analyzing progress:', error);
    res.status(500).json({ success: false, error: 'Error analyzing progress' });
  }
});

// Search exercises
aiRoutes.get('/exercises', optionalAuth, async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
  try {
    const { category, muscleGroup, equipment, difficulty, search } = req.query;

    const where: any = {};

    if (category) where.category = category;
    if (muscleGroup) where.muscleGroup = muscleGroup;
    if (equipment) where.equipment = equipment;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const exercises = await prisma.exercises.findMany({
      where,
      take: 50,
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: { exercises } });
  } catch (error) {
    console.error('Error searching exercises:', error);
    res.status(500).json({ success: false, error: 'Error searching exercises' });
  }
});

// Search foods
aiRoutes.get('/foods', optionalAuth, async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
  try {
    const { category, search, minCalories, maxCalories } = req.query;

    const where: any = {};

    if (category) where.category = category;
    if (search) {
      where.name = { contains: search as string, mode: 'insensitive' };
    }
    if (minCalories || maxCalories) {
      where.calories = {};
      if (minCalories) where.calories.gte = parseFloat(minCalories as string);
      if (maxCalories) where.calories.lte = parseFloat(maxCalories as string);
    }

    const foods = await prisma.food_items.findMany({
      where,
      take: 50,
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: { foods } });
  } catch (error) {
    console.error('Error searching foods:', error);
    res.status(500).json({ success: false, error: 'Error searching foods' });
  }
});

