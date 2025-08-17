import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: errors.array(),
    });
    return;
  }
  next();
};

// User registration validations
export const validateRegistration = [
  body('email').isEmail().withMessage('Email must be a valid email address').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long')
    .trim(),
  body('age').optional().isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('date_of_birth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
  body('weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Weight must be between 30 and 300 kg'),
  body('weight_kg')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Weight must be between 30 and 300 kg'),
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('height_cm')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('goal')
    .optional()
    .isIn(['lose_weight', 'gain_muscle', 'maintain', 'improve_fitness'])
    .withMessage('Goal must be one of: lose_weight, gain_muscle, maintain, improve_fitness'),
  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'])
    .withMessage(
      'Activity level must be one of: sedentary, lightly_active, moderately_active, very_active, extremely_active'
    ),
  body('activity_level')
    .optional()
    .isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'])
    .withMessage(
      'Activity level must be one of: sedentary, lightly_active, moderately_active, very_active, extremely_active'
    ),
  handleValidationErrors,
];

// User login validations
export const validateLogin = [
  body('email').isEmail().withMessage('Email must be a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// User profile update validations
export const validateProfileUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long')
    .trim(),
  body('age').optional().isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Weight must be between 30 and 300 kg'),
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('goal')
    .optional()
    .isIn(['lose_weight', 'gain_muscle', 'maintain', 'improve_fitness'])
    .withMessage('Goal must be one of: lose_weight, gain_muscle, maintain, improve_fitness'),
  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'])
    .withMessage(
      'Activity level must be one of: sedentary, lightly_active, moderately_active, very_active, extremely_active'
    ),
  handleValidationErrors,
];

// Password change validations
export const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'New password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  handleValidationErrors,
];

// Log creation validations
export const validateLogCreation = [
  body('type')
    .isIn(['food', 'exercise', 'weight', 'measurement'])
    .withMessage('Type must be one of: food, exercise, weight, measurement'),
  body('data').isObject().withMessage('Data must be an object'),
  body('calories')
    .optional()
    .isInt({ min: 0, max: 5000 })
    .withMessage('Calories must be between 0 and 5000'),
  body('date').optional().isISO8601().withMessage('Date must be valid'),
  handleValidationErrors,
];

// Meal plan creation validations
export const validateMealPlanCreation = [
  body('date').isISO8601().withMessage('Date must be valid'),
  body('meals').isObject().withMessage('Meals must be an object'),
  body('totalCalories')
    .isInt({ min: 500, max: 5000 })
    .withMessage('Total calories must be between 500 and 5000'),
  handleValidationErrors,
];

// Workout plan creation validations
export const validateWorkoutPlanCreation = [
  body('date').isISO8601().withMessage('Date must be valid'),
  body('exercises').isArray().withMessage('Exercises must be an array'),
  body('duration')
    .optional()
    .isInt({ min: 10, max: 300 })
    .withMessage('Duration must be between 10 and 300 minutes'),
  handleValidationErrors,
];

// Meal plan generation validations
export const validateMealPlanGeneration = [
  body('date').isISO8601().withMessage('Date must be valid'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
  body('restrictions').optional().isArray().withMessage('Restrictions must be an array'),
  body('targetCalories')
    .optional()
    .isInt({ min: 1000, max: 5000 })
    .withMessage('Target calories must be between 1000 and 5000'),
  handleValidationErrors,
];

// Workout plan generation validations
export const validateWorkoutPlanGeneration = [
  body('date').isISO8601().withMessage('Date must be valid'),
  body('focus')
    .optional()
    .isIn(['full_body', 'upper_body', 'lower_body', 'cardio', 'strength', 'flexibility'])
    .withMessage(
      'Focus must be one of: full_body, upper_body, lower_body, cardio, strength, flexibility'
    ),
  body('duration')
    .optional()
    .isInt({ min: 15, max: 180 })
    .withMessage('Duration must be between 15 and 180 minutes'),
  body('equipment').optional().isArray().withMessage('Equipment must be an array'),
  handleValidationErrors,
];

// Query parameter validations
export const validateQueryParams = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid'),
  handleValidationErrors,
];

// Route parameter validations
export const validateIdParam = [
  param('id').isUUID().withMessage('ID must be a valid UUID'),
  handleValidationErrors,
];
