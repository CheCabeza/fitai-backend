import crypto from 'crypto';
import express from 'express';
import { getSupabase } from '../config/supabase';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { ApiResponseExpress, AuthenticatedRequest } from '../types';
import {
  generateMealPlan,
  generateWorkoutPlan,
  getFitnessRecommendations,
} from '../utils/ai';

export const aiRoutes = express.Router();

// Generate personalized meal plan
aiRoutes.post(
  '/generate-meal-plan',
  authenticateToken,
  async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
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
    const supabase = getSupabase();
    if (!supabase) {
      res.status(500).json({ success: false, error: 'Database connection error' });
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(
        'date_of_birth, weight_kg, height_cm, fitness_goals, activity_level, dietary_restrictions',
      )
      .eq('id', req.user.id)
      .single();

    if (userError || !userData) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Convert Supabase data to expected format
    const user = {
      age: userData.date_of_birth ? new Date().getFullYear() - new Date(userData.date_of_birth).getFullYear() : 25,
      weight: userData.weight_kg,
      height: userData.height_cm,
      goal: userData.fitness_goals?.[0] || 'maintain',
      activityLevel: userData.activity_level,
      restrictions: userData.dietary_restrictions || [],
    };

    // Generate meal plan using AI
    const mealPlan = await generateMealPlan({
      user,
      date: new Date(date),
      preferences: preferences || {},
      restrictions: restrictions || user?.restrictions || [],
      targetCalories: targetCalories || 2000,
    });

    // Save to database
    const { data: savedMealPlan, error: saveError } = await supabase
      .from('meal_plans')
      .insert({
        id: crypto.randomUUID(),
        user_id: req.user.id,
        date: new Date(date).toISOString().split('T')[0],
        meals: mealPlan.meals,
        total_calories: mealPlan.totalCalories,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving meal plan:', saveError);
      res.status(500).json({ success: false, error: 'Error saving meal plan' });
      return;
    }

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
    const supabase = getSupabase();
    if (!supabase) {
      res.status(500).json({ success: false, error: 'Database connection error' });
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('date_of_birth, weight_kg, height_cm, fitness_goals, activity_level')
      .eq('id', req.user.id)
      .single();

    if (userError || !userData) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Convert Supabase data to expected format
    const user = {
      age: userData.date_of_birth ? new Date().getFullYear() - new Date(userData.date_of_birth).getFullYear() : 25,
      weight: userData.weight_kg,
      height: userData.height_cm,
      goal: userData.fitness_goals?.[0] || 'maintain',
      activityLevel: userData.activity_level,
    };

    // Generate workout plan using AI
    const workoutPlan = await generateWorkoutPlan({
      user,
      date: new Date(date),
      focus: focus || 'full_body',
      duration: duration || 45,
      equipment: equipment || ['bodyweight'],
    });

    // Save to database
    const { data: savedWorkoutPlan, error: saveError } = await supabase
      .from('workout_plans')
      .insert({
        id: crypto.randomUUID(),
        user_id: req.user.id,
        date: new Date(date).toISOString().split('T')[0],
        exercises: workoutPlan.exercises,
        duration: workoutPlan.duration || null,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving workout plan:', saveError);
      res.status(500).json({ success: false, error: 'Error saving workout plan' });
      return;
    }

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
      const supabase = getSupabase();
      if (supabase) {
        const { data: userDataFromDB, error: userError } = await supabase
          .from('users')
          .select('date_of_birth, weight_kg, height_cm, fitness_goals, activity_level')
          .eq('id', req.user.id)
          .single();

        if (!userError && userDataFromDB) {
          userData = {
            age: userDataFromDB.date_of_birth ? new Date().getFullYear() - new Date(userDataFromDB.date_of_birth).getFullYear() : 25,
            weight: userDataFromDB.weight_kg,
            height: userDataFromDB.height_cm,
            goal: userDataFromDB.fitness_goals?.[0] || 'fitness',
            activityLevel: userDataFromDB.activity_level,
          };
        }
      }
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

    const supabase = getSupabase();
    if (!supabase) {
      res.status(500).json({ success: false, error: 'Database connection error' });
      return;
    }

    // Build query filters
    let query = supabase.from('user_logs').select('*').eq('user_id', req.user.id);
    if (startDate) {
      query = query.gte('log_date', startDate as string);
    }
    if (endDate) {
      query = query.lte('log_date', endDate as string);
    }

    // Get logs from the period
    const { data: logs, error: logsError } = await query.order('log_date', { ascending: true });

    if (logsError) {
      console.error('Error fetching logs:', logsError);
      res.status(500).json({ success: false, error: 'Error fetching logs' });
      return;
    }

    // Get meal and workout plans
    let mealPlansQuery = supabase.from('meal_plans').select('*').eq('user_id', req.user.id);
    if (startDate) {
      mealPlansQuery = mealPlansQuery.gte('date', startDate as string);
    }
    if (endDate) {
      mealPlansQuery = mealPlansQuery.lte('date', endDate as string);
    }
    const { data: mealPlans, error: mealPlansError } = await mealPlansQuery.order('date', { ascending: true });

    let workoutPlansQuery = supabase.from('workout_plans').select('*').eq('user_id', req.user.id);
    if (startDate) {
      workoutPlansQuery = workoutPlansQuery.gte('date', startDate as string);
    }
    if (endDate) {
      workoutPlansQuery = workoutPlansQuery.lte('date', endDate as string);
    }
    const { data: workoutPlans, error: workoutPlansError } = await workoutPlansQuery.order('date', { ascending: true });

    if (mealPlansError || workoutPlansError) {
      console.error('Error fetching plans:', { mealPlansError, workoutPlansError });
      res.status(500).json({ success: false, error: 'Error fetching plans' });
      return;
    }

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

    const supabase = getSupabase();
    if (!supabase) {
      res.status(500).json({ success: false, error: 'Database connection error' });
      return;
    }

    let query = supabase.from('exercises').select('*').limit(50).order('name', { ascending: true });

    if (category) query = query.eq('category', category);
    if (muscleGroup) query = query.eq('muscle_group', muscleGroup);
    if (equipment) query = query.eq('equipment', equipment);
    if (difficulty) query = query.eq('difficulty_level', difficulty);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: exercises, error: exercisesError } = await query;

    if (exercisesError) {
      console.error('Error searching exercises:', exercisesError);
      res.status(500).json({ success: false, error: 'Error searching exercises' });
      return;
    }

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

    const supabase = getSupabase();
    if (!supabase) {
      res.status(500).json({ success: false, error: 'Database connection error' });
      return;
    }

    let query = supabase.from('foods').select('*').limit(50).order('name', { ascending: true });

    if (category) query = query.eq('category', category);
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (minCalories) {
      query = query.gte('calories_per_100g', parseFloat(minCalories as string));
    }
    if (maxCalories) {
      query = query.lte('calories_per_100g', parseFloat(maxCalories as string));
    }

    const { data: foods, error: foodsError } = await query;

    if (foodsError) {
      console.error('Error searching foods:', foodsError);
      res.status(500).json({ success: false, error: 'Error searching foods' });
      return;
    }

    res.json({ success: true, data: { foods } });
  } catch (error) {
    console.error('Error searching foods:', error);
    res.status(500).json({ success: false, error: 'Error searching foods' });
  }
});

