import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../app';

// Get the mocked Prisma client
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

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
      // Mock findUnique to return null (user doesn't exist)
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValueOnce(null);
      
      // Mock create to return a new user
      (mockPrisma.users.create as jest.Mock).mockResolvedValueOnce({
        id: 'new-user-id',
        email: testUser.email,
        name: testUser.name,
        age: testUser.age,
        weight: testUser.weight,
        height: testUser.height,
        goal: testUser.goal,
        activityLevel: testUser.activityLevel,
        restrictions: testUser.restrictions,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };

      const res = await request(app).post('/api/auth/register').send(invalidUser).expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should fail with short password', async () => {
      const invalidUser = { ...testUser, password: '123' };

      const res = await request(app).post('/api/auth/register').send(invalidUser).expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');

      authToken = res.body.token;
    });

    it('should fail with invalid credentials', async () => {
      // Mock bcrypt.compare to return false for invalid password
      const bcrypt = require('bcryptjs');
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

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
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should fail without token', async () => {
      const res = await request(app).get('/api/auth/profile').expect(401);

      expect(res.body).toHaveProperty('error', 'Access token required');
    });
  });
});
