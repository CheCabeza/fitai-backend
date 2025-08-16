import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitAI Backend API',
      version: '1.0.0',
      description: 'API for fitness and nutrition application with AI',
      contact: {
        name: 'FitAI Team',
        email: 'support@fitai.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api.fitai.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string', minLength: 2, maxLength: 50 },
            age: { type: 'integer', minimum: 13, maximum: 120 },
            weight: { type: 'number', minimum: 30, maximum: 300 },
            height: { type: 'number', minimum: 100, maximum: 250 },
            goal: {
              type: 'string',
              enum: ['lose_weight', 'gain_muscle', 'maintain', 'fitness'],
            },
            activityLevel: {
              type: 'string',
              enum: ['sedentary', 'light', 'moderate', 'very', 'extreme'],
            },
            restrictions: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserLog: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date-time' },
            type: {
              type: 'string',
              enum: ['food', 'exercise', 'weight', 'measurement'],
            },
            data: { type: 'object' },
            calories: { type: 'integer', minimum: 0 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        MealPlan: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date' },
            meals: { type: 'object' },
            totalCalories: { type: 'integer', minimum: 500 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        WorkoutPlan: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date' },
            exercises: { type: 'array' },
            duration: { type: 'integer', minimum: 10 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpecs = swaggerJsdoc(options);
