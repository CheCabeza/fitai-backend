// Test configuration
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-secret-key';
process.env['SUPABASE_URL'] = 'https://test.supabase.co';
process.env['SUPABASE_ANON_KEY'] = 'test-anon-key';
process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-service-key';

// Mock Supabase Client for tests
jest.mock('../config/supabase', () => {
  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };

  return {
    getSupabase: jest.fn().mockReturnValue(mockSupabaseClient),
    getSupabaseAnon: jest.fn().mockReturnValue(mockSupabaseClient),
    validateSupabaseConfig: jest.fn(),
  };
});

// Mock bcrypt for password hashing
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock OpenAI for tests
jest.mock('openai', () => {
  const mockOpenAI = jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  meals: {
                    breakfast: { name: 'Test Breakfast', foods: [], totalCalories: 400 },
                    lunch: { name: 'Test Lunch', foods: [], totalCalories: 600 },
                    dinner: { name: 'Test Dinner', foods: [], totalCalories: 500 },
                    snacks: { name: 'Test Snacks', foods: [], totalCalories: 200 },
                  },
                  totalCalories: 1700,
                  recommendations: ['Test recommendation 1', 'Test recommendation 2'],
                }),
              },
            },
          ],
        }),
      },
    },
  }));

  // Export as default for ES6 imports
  const OpenAI = mockOpenAI as any;
  OpenAI.default = mockOpenAI;

  return OpenAI;
});

// Global test timeout
jest.setTimeout(10000);
