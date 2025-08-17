// Mock data for tests
export const mockUser = {
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
};

export const mockExercises = [
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
];

export const mockFoods = [
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
];

// Setup mock implementations
export const setupPrismaMocks = () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    exercise: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    foodItem: {
      findMany: jest.fn(),
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

  // Default mock implementations
  mockPrisma.user.findUnique.mockResolvedValue(mockUser);
  mockPrisma.user.create.mockResolvedValue(mockUser);
  mockPrisma.exercise.findMany.mockResolvedValue(mockExercises);
  mockPrisma.foodItem.findMany.mockResolvedValue(mockFoods);

  return mockPrisma;
};
