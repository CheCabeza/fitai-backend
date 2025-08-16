import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth';
import {
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate,
  validateRegistration,
} from '../middleware/validation';
import { AuthenticatedRequest, PasswordChangeData, UserLoginData, UserProfileUpdateData, UserRegistrationData } from '../types';

export const authRoutes = express.Router();
const prisma = new PrismaClient();

// User registration
authRoutes.post('/register', validateRegistration, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, age, weight, height, goal, activityLevel, restrictions } = req.body as UserRegistrationData;

    // Basic validations
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password and name are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email is already registered' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        age: age ? parseInt(age.toString()) : null,
        weight: weight ? parseFloat(weight.toString()) : null,
        height: height ? parseFloat(height.toString()) : null,
        goal: goal || null,
        activityLevel: activityLevel || null,
        restrictions: restrictions || [],
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        weight: true,
        height: true,
        goal: true,
        activityLevel: true,
        restrictions: true,
        createdAt: true,
      },
    });

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env['JWT_SECRET']!, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// User login
authRoutes.post('/login', validateLogin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as UserLoginData;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env['JWT_SECRET']!, {
      expiresIn: '7d',
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

// Get user profile
authRoutes.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        weight: true,
        height: true,
        goal: true,
        activityLevel: true,
        restrictions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Error getting profile' });
  }
});

// Update user profile
authRoutes.put('/profile', authenticateToken, validateProfileUpdate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { name, age, weight, height, goal, activityLevel, restrictions } = req.body as UserProfileUpdateData;

    const userData: any = {};
    if (name !== undefined) userData.name = name;
    if (age !== undefined) userData.age = age;
    if (weight !== undefined) userData.weight = weight;
    if (height !== undefined) userData.height = height;
    if (goal !== undefined) userData.goal = goal;
    if (activityLevel !== undefined) userData.activityLevel = activityLevel;
    if (restrictions !== undefined) userData.restrictions = restrictions;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        weight: true,
        height: true,
        goal: true,
        activityLevel: true,
        restrictions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Change password
authRoutes.put('/change-password', authenticateToken, validatePasswordChange, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { currentPassword, newPassword } = req.body as PasswordChangeData;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        error: 'New password must be at least 6 characters long',
      });
      return;
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Error changing password' });
  }
});

// Delete user account
authRoutes.delete('/account', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    await prisma.user.delete({
      where: { id: req.user.id },
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Error deleting account' });
  }
});
