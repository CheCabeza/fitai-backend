import { Router } from 'express';
import CronService from '../services/cronService';

const cronRoutes = Router();
const cronService = new CronService();

// Manual trigger for exercise generation
cronRoutes.post('/populate-exercises', async (_req, res) => {
  try {
    console.log('🔄 Manual AI exercise generation triggered via API');
    await cronService.triggerExerciseGeneration();
    res.json({ success: true, message: 'AI exercise generation completed' });
  } catch (error) {
    console.error('Error in manual AI exercise generation:', error);
    res.status(500).json({ success: false, error: 'Error generating AI exercise' });
  }
});

// Manual trigger for food generation
cronRoutes.post('/populate-foods', async (_req, res) => {
  try {
    console.log('🔄 Manual AI food generation triggered via API');
    await cronService.triggerFoodGeneration();
    res.json({ success: true, message: 'AI food generation completed' });
  } catch (error) {
    console.error('Error in manual AI food generation:', error);
    res.status(500).json({ success: false, error: 'Error generating AI food' });
  }
});

// Manual trigger for full generation
cronRoutes.post('/populate-all', async (_req, res) => {
  try {
    console.log('🔄 Manual full AI generation triggered via API');
    await cronService.triggerFullGeneration();
    res.json({ success: true, message: 'Full AI generation completed' });
  } catch (error) {
    console.error('Error in manual full AI generation:', error);
    res.status(500).json({ success: false, error: 'Error generating AI data' });
  }
});

// Get cron status
cronRoutes.get('/status', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'active',
      schedule: {
        exercises: 'Daily at 2:00 AM',
        foods: 'Daily at 3:00 AM',
      },
      limits: {
        exercises_per_day: 1,
        foods_per_day: 1,
      },
      ai_generation: {
        model: 'gpt-3.5-turbo',
        max_tokens_exercise: 200,
        max_tokens_food: 150,
        temperature: 0.7,
      },
      endpoints: {
        populate_exercises: 'POST /api/cron/populate-exercises',
        populate_foods: 'POST /api/cron/populate-foods',
        populate_all: 'POST /api/cron/populate-all',
      },
    },
  });
});

export default cronRoutes;
