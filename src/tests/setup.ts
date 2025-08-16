// Test configuration
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-secret-key';
process.env['DATABASE_URL'] = 'postgresql://user:password@localhost:5432/fitai_test?schema=public';

// Mock Prisma Client for tests
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        name: 'Test User',
        age: 25,
        weight: 70,
        height: 175,
        goal: 'lose_weight',
        activityLevel: 'moderate',
        restrictions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      create: jest.fn().mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        name: 'Test User',
        age: 25,
        weight: 70,
        height: 175,
        goal: 'lose_weight',
        activityLevel: 'moderate',
        restrictions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: jest.fn(),
      delete: jest.fn(),
    },
    exercise: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'exercise-1',
          name: 'Push-ups',
          category: 'strength',
          muscleGroup: 'chest',
          equipment: 'bodyweight',
          difficulty: 'beginner',
          caloriesPerMin: 8,
          description: 'Push-ups for chest development',
          instructions: ['Start in plank position', 'Lower body', 'Push back up'],
          createdAt: new Date(),
        },
        {
          id: 'exercise-2',
          name: 'Squats',
          category: 'strength',
          muscleGroup: 'legs',
          equipment: 'bodyweight',
          difficulty: 'beginner',
          caloriesPerMin: 8,
          description: 'Squats for leg development',
          instructions: ['Stand with feet shoulder-width', 'Lower body', 'Return to start'],
          createdAt: new Date(),
        },
      ]),
      create: jest.fn(),
    },
    foodItem: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'food-1',
          name: 'Chicken Breast',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          fiber: 0,
          category: 'protein',
          createdAt: new Date(),
        },
        {
          id: 'food-2',
          name: 'Brown Rice',
          calories: 110,
          protein: 2.5,
          carbs: 23,
          fat: 0.9,
          fiber: 1.8,
          category: 'carbs',
          createdAt: new Date(),
        },
      ]),
      create: jest.fn(),
    },
    userLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    mealPlan: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    workoutPlan: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Mock bcrypt for password hashing
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock OpenAI for AI endpoints
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  recommendations: [
                    { type: 'exercise', name: 'Push-ups', description: 'Great for chest' },
                    { type: 'nutrition', name: 'Protein shake', description: 'Post-workout' },
                  ],
                }),
              },
            },
          ],
        }),
      },
    },
  })),
}));

// Global test timeout
jest.setTimeout(10000);
