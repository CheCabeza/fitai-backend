import crypto from 'crypto';
import express, { Response } from 'express';
import { getSupabase } from '../config/supabase';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

export const userRoutes = express.Router();

// Get user logs
userRoutes.get(
  '/logs',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { type, startDate, endDate, limit = 50 } = req.query;

      const where: any = {
        userId: req.user!.id,
      };

      if (type) {
        where.type = type;
      }

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate as string);
        if (endDate) where.date.lte = new Date(endDate as string);
      }

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database connection error' });
        return;
      }

      let query = supabase
        .from('user_logs')
        .select('*, users(first_name, last_name, email)')
        .eq('user_id', req.user!.id);

      if (type) {
        query = query.eq('log_type', type);
      }

      if (startDate) {
        query = query.gte('log_date', startDate as string);
      }

      if (endDate) {
        query = query.lte('log_date', endDate as string);
      }

      const { data: logs, error: logsError } = await query
        .order('log_date', { ascending: false })
        .limit(parseInt(limit as string));

      if (logsError) {
        console.error('Error getting logs:', logsError);
        res.status(500).json({ error: 'Error getting logs' });
        return;
      }

      res.json({ logs });
    } catch (error) {
      console.error('Error getting logs:', error);
      res.status(500).json({ error: 'Error getting logs' });
    }
  }
);

// Create user log
userRoutes.post(
  '/logs',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { type, data, date } = req.body;

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database connection error' });
        return;
      }

      const { data: log, error: logError } = await supabase
        .from('user_logs')
        .insert({
          id: crypto.randomUUID(),
          user_id: req.user.id,
          log_type: type,
          data,
          log_date: date
            ? new Date(date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        })
        .select('*, users(first_name, last_name, email)')
        .single();

      if (logError) {
        console.error('Error creating log:', logError);
        res.status(500).json({ error: 'Error creating log' });
        return;
      }

      res.status(201).json({ log });
    } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ error: 'Error creating log' });
    }
  }
);

// Get user meal plans
userRoutes.get(
  '/meal-plans',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, limit = 50 } = req.query;

      const where: any = {
        userId: req.user!.id,
      };

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate as string);
        if (endDate) where.date.lte = new Date(endDate as string);
      }

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database connection error' });
        return;
      }

      let query = supabase.from('meal_plans').select('*').eq('user_id', req.user!.id);

      if (startDate) {
        query = query.gte('date', startDate as string);
      }

      if (endDate) {
        query = query.lte('date', endDate as string);
      }

      const { data: mealPlans, error: mealPlansError } = await query
        .order('date', { ascending: false })
        .limit(parseInt(limit as string));

      if (mealPlansError) {
        console.error('Error getting meal plans:', mealPlansError);
        res.status(500).json({ error: 'Error getting meal plans' });
        return;
      }

      res.json({ mealPlans });
    } catch (error) {
      console.error('Error getting meal plans:', error);
      res.status(500).json({ error: 'Error getting meal plans' });
    }
  }
);

// Get user workout plans
userRoutes.get(
  '/workout-plans',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, limit = 50 } = req.query;

      const where: any = {
        userId: req.user!.id,
      };

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate as string);
        if (endDate) where.date.lte = new Date(endDate as string);
      }

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database connection error' });
        return;
      }

      let query = supabase.from('workout_plans').select('*').eq('user_id', req.user!.id);

      if (startDate) {
        query = query.gte('date', startDate as string);
      }

      if (endDate) {
        query = query.lte('date', endDate as string);
      }

      const { data: workoutPlans, error: workoutPlansError } = await query
        .order('date', { ascending: false })
        .limit(parseInt(limit as string));

      if (workoutPlansError) {
        console.error('Error getting workout plans:', workoutPlansError);
        res.status(500).json({ error: 'Error getting workout plans' });
        return;
      }

      res.json({ workoutPlans });
    } catch (error) {
      console.error('Error getting workout plans:', error);
      res.status(500).json({ error: 'Error getting workout plans' });
    }
  }
);

// Get user statistics
userRoutes.get(
  '/statistics',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      const where: any = {
        userId: req.user!.id,
      };

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate as string);
        if (endDate) where.date.lte = new Date(endDate as string);
      }

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database connection error' });
        return;
      }

      // Build query filters for each table
      let logsQuery = supabase
        .from('user_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user!.id);
      let mealPlansQuery = supabase
        .from('meal_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user!.id);
      let workoutPlansQuery = supabase
        .from('workout_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user!.id);

      if (startDate) {
        logsQuery = logsQuery.gte('log_date', startDate as string);
        mealPlansQuery = mealPlansQuery.gte('date', startDate as string);
        workoutPlansQuery = workoutPlansQuery.gte('date', startDate as string);
      }

      if (endDate) {
        logsQuery = logsQuery.lte('log_date', endDate as string);
        mealPlansQuery = mealPlansQuery.lte('date', endDate as string);
        workoutPlansQuery = workoutPlansQuery.lte('date', endDate as string);
      }

      const [logsResult, mealPlansResult, workoutPlansResult] = await Promise.all([
        logsQuery,
        mealPlansQuery,
        workoutPlansQuery,
      ]);

      const totalLogs = logsResult.count || 0;
      const totalMealPlans = mealPlansResult.count || 0;
      const totalWorkoutPlans = workoutPlansResult.count || 0;

      res.json({
        statistics: {
          totalLogs,
          totalMealPlans,
          totalWorkoutPlans,
        },
      });
    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(500).json({ error: 'Error getting statistics' });
    }
  }
);
