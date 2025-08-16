import { PrismaClient } from '@prisma/client';
import express, { Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

export const userRoutes = express.Router();
const prisma = new PrismaClient();

// Get user logs
userRoutes.get('/logs', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    const logs = await prisma.userLog.findMany({
      where,
      orderBy: { date: 'desc' },
      take: parseInt(limit as string),
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    res.json({ logs });
  } catch (error) {
    console.error('Error getting logs:', error);
    res.status(500).json({ error: 'Error getting logs' });
  }
});

// Create user log
userRoutes.post('/logs', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { type, data, calories, date } = req.body;

    const log = await prisma.userLog.create({
      data: {
        userId: req.user.id,
        type,
        data,
        calories: calories || null,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    res.status(201).json({ log });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Error creating log' });
  }
});

// Get user meal plans
userRoutes.get('/meal-plans', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    const mealPlans = await prisma.mealPlan.findMany({
      where,
      orderBy: { date: 'desc' },
      take: parseInt(limit as string),
    });

    res.json({ mealPlans });
  } catch (error) {
    console.error('Error getting meal plans:', error);
    res.status(500).json({ error: 'Error getting meal plans' });
  }
});

// Get user workout plans
userRoutes.get('/workout-plans', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    const workoutPlans = await prisma.workoutPlan.findMany({
      where,
      orderBy: { date: 'desc' },
      take: parseInt(limit as string),
    });

    res.json({ workoutPlans });
  } catch (error) {
    console.error('Error getting workout plans:', error);
    res.status(500).json({ error: 'Error getting workout plans' });
  }
});

// Get user statistics
userRoutes.get('/statistics', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    const [totalLogs, totalMealPlans, totalWorkoutPlans] = await Promise.all([
      prisma.userLog.count({ where }),
      prisma.mealPlan.count({ where }),
      prisma.workoutPlan.count({ where }),
    ]);

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
});
