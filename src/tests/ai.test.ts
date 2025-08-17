import request from 'supertest';
import app from '../app';
import { getSupabase } from '../config/supabase';

// Get the mocked Supabase client
const mockSupabase = getSupabase() as jest.Mocked<any>;

describe('AI Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ai/recommendations', () => {
    it('should return fitness recommendations without authentication', async () => {
      const res = await request(app).get('/api/ai/recommendations');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('recommendations');
      expect(res.body.data).toHaveProperty('userData');
      expect(res.body.data.recommendations).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.data.recommendations.recommendations)).toBe(true);
    });

    it('should return recommendations with query parameters', async () => {
      const res = await request(app).get(
        '/api/ai/recommendations?goal=gain_muscle&activityLevel=moderate'
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('recommendations');
      expect(res.body.data.userData.goal).toBe('gain_muscle');
      expect(res.body.data.userData.activityLevel).toBe('moderate');
    });
  });

  describe('GET /api/ai/exercises', () => {
    it('should return exercises list', async () => {
      // Mock Supabase responses for exercises
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 'exercise-1',
                  name: 'Push-ups',
                  description: 'Push-ups for chest development',
                  muscle_group: 'chest',
                  equipment: 'bodyweight',
                  difficulty_level: 'beginner',
                  instructions: 'Start in plank position, lower body, push back up',
                  video_url: null,
                  image_url: null,
                  created_at: new Date(),
                },
                {
                  id: 'exercise-2',
                  name: 'Squats',
                  description: 'Squats for leg development',
                  muscle_group: 'legs',
                  equipment: 'bodyweight',
                  difficulty_level: 'beginner',
                  instructions: 'Stand with feet shoulder-width, lower body, return to start',
                  video_url: null,
                  image_url: null,
                  created_at: new Date(),
                },
              ],
              error: null,
            }),
          }),
        }),
      });

      const res = await request(app).get('/api/ai/exercises');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('exercises');
      expect(Array.isArray(res.body.data.exercises)).toBe(true);
    });

    it('should filter exercises by category', async () => {
      // Mock Supabase responses for filtered exercises
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 'exercise-1',
                    name: 'Push-ups',
                    description: 'Push-ups for chest development',
                    muscle_group: 'chest',
                    equipment: 'bodyweight',
                    difficulty_level: 'beginner',
                    instructions: 'Start in plank position, lower body, push back up',
                    video_url: null,
                    image_url: null,
                    created_at: new Date(),
                  },
                ],
                error: null,
              }),
            }),
          }),
        }),
      });

      const res = await request(app).get('/api/ai/exercises?category=strength');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('exercises');
      expect(Array.isArray(res.body.data.exercises)).toBe(true);
    });
  });

  describe('GET /api/ai/foods', () => {
    it('should return foods list', async () => {
      // Mock Supabase responses for foods
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 'food-1',
                  name: 'Chicken Breast',
                  description: 'Lean protein source',
                  calories_per_100g: 165,
                  protein_g: 31,
                  carbs_g: 0,
                  fat_g: 3.6,
                  fiber_g: 0,
                  category: 'protein',
                  created_at: new Date(),
                },
                {
                  id: 'food-2',
                  name: 'Brown Rice',
                  description: 'Whole grain carbohydrate',
                  calories_per_100g: 110,
                  protein_g: 2.5,
                  carbs_g: 23,
                  fat_g: 0.9,
                  fiber_g: 1.8,
                  category: 'grains',
                  created_at: new Date(),
                },
              ],
              error: null,
            }),
          }),
        }),
      });

      const res = await request(app).get('/api/ai/foods');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('foods');
      expect(Array.isArray(res.body.data.foods)).toBe(true);
    });

    it('should filter foods by category', async () => {
      // Mock Supabase responses for filtered foods
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 'food-1',
                    name: 'Chicken Breast',
                    description: 'Lean protein source',
                    calories_per_100g: 165,
                    protein_g: 31,
                    carbs_g: 0,
                    fat_g: 3.6,
                    fiber_g: 0,
                    category: 'protein',
                    created_at: new Date(),
                  },
                ],
                error: null,
              }),
            }),
          }),
        }),
      });

      const res = await request(app).get('/api/ai/foods?category=protein');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('foods');
      expect(Array.isArray(res.body.data.foods)).toBe(true);
    });
  });
});
