import request from 'supertest';
import app from '../app';
import { getSupabase } from '../config/supabase';

// Get the mocked Supabase client
const mockSupabase = getSupabase() as jest.Mocked<any>;

describe('Auth Endpoints', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!',
    name: 'Test User',
    age: 25,
    weight: 70,
    height: 175,
    goal: 'lose_weight',
    activityLevel: 'moderate',
    restrictions: [],
  };

  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock Supabase responses
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'new-user-id',
                email: testUser.email,
                first_name: 'Test',
                last_name: 'User',
                date_of_birth: '1990-01-01',
                gender: 'male',
                height_cm: 175,
                weight_kg: 70,
                activity_level: 'moderately_active',
                fitness_goals: ['lose weight'],
                dietary_restrictions: [],
                created_at: new Date(),
                updated_at: new Date(),
              },
              error: null,
            }),
          }),
        }),
      });

      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };

      const res = await request(app).post('/api/auth/register').send(invalidUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail with short password', async () => {
      const invalidUser = { ...testUser, password: '123' };

      const res = await request(app).post('/api/auth/register').send(invalidUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Mock bcrypt for password comparison
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      // Mock Supabase responses for login
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'test-user-id',
                email: testUser.email,
                password_hash: '$2b$10$hashedpassword',
                first_name: 'Test',
                last_name: 'User',
                date_of_birth: '1990-01-01',
                gender: 'male',
                height_cm: 175,
                weight_kg: 70,
                activity_level: 'moderately_active',
                fitness_goals: ['lose weight'],
                dietary_restrictions: [],
                created_at: new Date(),
                updated_at: new Date(),
              },
              error: null,
            }),
          }),
        }),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');

      authToken = res.body.token;
    });

    it('should fail with invalid credentials', async () => {
      // Mock Supabase to return no user
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      // Mock Supabase responses for profile
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'test-user-id',
                email: testUser.email,
                first_name: 'Test',
                last_name: 'User',
                date_of_birth: '1990-01-01',
                gender: 'male',
                height_cm: 175,
                weight_kg: 70,
                activity_level: 'moderately_active',
                fitness_goals: ['lose weight'],
                dietary_restrictions: [],
                created_at: new Date(),
                updated_at: new Date(),
              },
              error: null,
            }),
          }),
        }),
      });

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should fail without valid token', async () => {
      const res = await request(app).get('/api/auth/profile');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Access token required');
    });
  });
});
