import request from 'supertest';
import app from '../app';

describe('AI Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ai/recommendations', () => {
    it('should return fitness recommendations without authentication', async () => {
      const res = await request(app).get('/api/ai/recommendations').expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('recommendations');
      expect(res.body.data).toHaveProperty('userData');
      expect(res.body.data.recommendations).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.data.recommendations.recommendations)).toBe(
        true,
      );
    });

    it('should return recommendations with query parameters', async () => {
      const res = await request(app)
        .get('/api/ai/recommendations?goal=gain_muscle&activityLevel=moderate')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('recommendations');
      expect(res.body.data.userData.goal).toBe('gain_muscle');
      expect(res.body.data.userData.activityLevel).toBe('moderate');
    });
  });

  describe('GET /api/ai/exercises', () => {
    it('should return exercises list', async () => {
      const res = await request(app).get('/api/ai/exercises').expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('exercises');
      expect(Array.isArray(res.body.data.exercises)).toBe(true);
    });

    it('should filter exercises by category', async () => {
      const res = await request(app)
        .get('/api/ai/exercises?category=strength')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('exercises');
      expect(Array.isArray(res.body.data.exercises)).toBe(true);
    });
  });

  describe('GET /api/ai/foods', () => {
    it('should return foods list', async () => {
      const res = await request(app).get('/api/ai/foods').expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('foods');
      expect(Array.isArray(res.body.data.foods)).toBe(true);
    });

    it('should filter foods by category', async () => {
      const res = await request(app)
        .get('/api/ai/foods?category=protein')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('foods');
      expect(Array.isArray(res.body.data.foods)).toBe(true);
    });
  });
});
