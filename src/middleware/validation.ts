import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from '../types';

// Middleware to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Error de validación',
      details: errors.array().map((err): ValidationError => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
        value: err.type === 'field' ? err.value : undefined,
      })),
    });
    return;
  }
  next();
};

// Registration validations
export const validateRegistration = [
  body('email').isEmail().withMessage('Email debe ser válido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Nombre debe tener entre 2 y 50 caracteres')
    .trim()
    .escape(),
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Edad debe ser entre 13 y 120 años'),
  body('weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Peso debe ser entre 30 y 300 kg'),
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Altura debe ser entre 100 y 250 cm'),
  body('goal')
    .optional()
    .isIn(['lose_weight', 'gain_muscle', 'maintain', 'fitness'])
    .withMessage('Objetivo debe ser uno de: lose_weight, gain_muscle, maintain, fitness'),
  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'light', 'moderate', 'very', 'extreme'])
    .withMessage('Nivel de actividad debe ser uno de: sedentary, light, moderate, very, extreme'),
  body('restrictions').optional().isArray().withMessage('Restricciones debe ser un array'),
  handleValidationErrors,
];

// Login validations
export const validateLogin = [
  body('email').isEmail().withMessage('Email debe ser válido').normalizeEmail(),
  body('password').notEmpty().withMessage('Contraseña es requerida'),
  handleValidationErrors,
];

// Profile update validations
export const validateProfileUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nombre debe tener entre 2 y 50 caracteres')
    .trim()
    .escape(),
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Edad debe ser entre 13 y 120 años'),
  body('weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Peso debe ser entre 30 y 300 kg'),
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Altura debe ser entre 100 y 250 cm'),
  body('goal')
    .optional()
    .isIn(['lose_weight', 'gain_muscle', 'maintain', 'fitness'])
    .withMessage('Objetivo debe ser uno de: lose_weight, gain_muscle, maintain, fitness'),
  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'light', 'moderate', 'very', 'extreme'])
    .withMessage('Nivel de actividad debe ser uno de: sedentary, light, moderate, very, extreme'),
  handleValidationErrors,
];

// Password change validations
export const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Nueva contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  handleValidationErrors,
];

// Log creation validations
export const validateLogCreation = [
  body('type')
    .isIn(['food', 'exercise', 'weight', 'measurement'])
    .withMessage('Tipo debe ser uno de: food, exercise, weight, measurement'),
  body('data').isObject().withMessage('Datos debe ser un objeto'),
  body('calories')
    .optional()
    .isInt({ min: 0, max: 5000 })
    .withMessage('Calorías debe ser entre 0 y 5000'),
  body('date').optional().isISO8601().withMessage('Fecha debe ser válida'),
  handleValidationErrors,
];

// Meal plan creation validations
export const validateMealPlanCreation = [
  body('date').isISO8601().withMessage('Fecha debe ser válida'),
  body('meals').isObject().withMessage('Comidas debe ser un objeto'),
  body('totalCalories')
    .isInt({ min: 500, max: 5000 })
    .withMessage('Calorías totales debe ser entre 500 y 5000'),
  handleValidationErrors,
];

// Workout plan creation validations
export const validateWorkoutPlanCreation = [
  body('date').isISO8601().withMessage('Fecha debe ser válida'),
  body('exercises').isArray().withMessage('Ejercicios debe ser un array'),
  body('duration')
    .optional()
    .isInt({ min: 10, max: 300 })
    .withMessage('Duración debe ser entre 10 y 300 minutos'),
  handleValidationErrors,
];

// Meal plan generation validations
export const validateMealPlanGeneration = [
  body('date').isISO8601().withMessage('Fecha debe ser válida'),
  body('preferences').optional().isObject().withMessage('Preferencias debe ser un objeto'),
  body('restrictions').optional().isArray().withMessage('Restricciones debe ser un array'),
  body('targetCalories')
    .optional()
    .isInt({ min: 1000, max: 5000 })
    .withMessage('Calorías objetivo debe ser entre 1000 y 5000'),
  handleValidationErrors,
];

// Workout plan generation validations
export const validateWorkoutPlanGeneration = [
  body('date').isISO8601().withMessage('Fecha debe ser válida'),
  body('focus')
    .optional()
    .isIn(['full_body', 'upper_body', 'lower_body', 'cardio', 'strength', 'flexibility'])
    .withMessage('Enfoque debe ser uno de: full_body, upper_body, lower_body, cardio, strength, flexibility'),
  body('duration')
    .optional()
    .isInt({ min: 15, max: 180 })
    .withMessage('Duración debe ser entre 15 y 180 minutos'),
  body('equipment').optional().isArray().withMessage('Equipamiento debe ser un array'),
  handleValidationErrors,
];

// Query parameter validations
export const validateQueryParams = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe ser entre 1 y 100'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio debe ser válida'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin debe ser válida'),
  handleValidationErrors,
];

// Route parameter validations
export const validateIdParam = [
  param('id').isUUID().withMessage('ID debe ser un UUID válido'),
  handleValidationErrors,
];
