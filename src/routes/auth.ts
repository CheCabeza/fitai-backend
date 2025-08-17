import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { getSupabase, validateSupabaseConfig } from '../config/supabase';
import { authenticateToken } from '../middleware/auth';
import {
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate,
  validateRegistration,
} from '../middleware/validation';
import { Inserts } from '../types/supabase';

// Local interfaces for this file
interface AuthenticatedRequest extends express.Request {
  user?: {
    userId: string;
    id: string;
    email: string;
  };
}

interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  age?: number;
  date_of_birth?: string;
  weight?: number;
  weight_kg?: number;
  height?: number;
  height_cm?: number;
  goal?: string;
  activityLevel?: string;
  activity_level?: string;
  restrictions?: string[];
}

interface UserLoginData {
  email: string;
  password: string;
}

interface UserProfileUpdateData {
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  activityLevel?: string;
  restrictions?: string[];
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export const authRoutes = express.Router();

// Validate Supabase configuration when routes are used
let supabaseValidated = false;
const ensureSupabaseConfig = () => {
  if (!supabaseValidated) {
    validateSupabaseConfig();
    supabaseValidated = true;
  }
};

// User registration
authRoutes.post(
  '/register',
  validateRegistration,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      ensureSupabaseConfig();

      const {
        email,
        password,
        name,
        age,
        date_of_birth,
        weight,
        weight_kg,
        height,
        height_cm,
        goal,
        activityLevel,
        activity_level,
        restrictions,
      } = req.body as UserRegistrationData;

      // Basic validations
      if (!email || !password || !name) {
        res.status(400).json({ error: 'Email, password and name are required' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database not configured' });
        return;
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        res.status(400).json({ error: 'Email is already registered' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Split name into first_name and last_name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Handle date of birth and age
      let dateOfBirth = null;
      if (date_of_birth) {
        dateOfBirth = date_of_birth;
      } else if (age) {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - age;
        dateOfBirth = `${birthYear}-01-01`; // Approximate date
      }

      // Handle height (convert to cm if needed)
      const finalHeight = height_cm || (height ? height * 100 : null);

      // Handle weight (use weight_kg if provided, otherwise weight)
      const finalWeight = weight_kg || weight;

      // Handle activity level
      const finalActivityLevel = activity_level || activityLevel;

      // Create user data
      const userData = {
        id: crypto.randomUUID(),
        email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        height_cm: finalHeight,
        weight_kg: finalWeight,
        activity_level: finalActivityLevel as any,
        fitness_goals: goal ? [goal] : null,
        dietary_restrictions: restrictions || null,
      } as Inserts<'users'>;

      // Create user
      const { data: user, error } = await supabase.from('users').insert(userData).select().single();

      if (error) {
        console.error('Supabase error:', error);
        res.status(500).json({ error: 'Error registering user' });
        return;
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env['JWT_SECRET']!, {
        expiresIn: '7d',
      });

      // Calculate age from date of birth for response
      let calculatedAge = null;
      if (user.date_of_birth) {
        const birthDate = new Date(user.date_of_birth);
        const today = new Date();
        calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
      }

      // Return user data without password
      const userResponse = {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim(),
        age: calculatedAge,
        weight: user.weight_kg,
        height: user.height_cm,
        goal: user.fitness_goals ? user.fitness_goals[0] : null,
        activityLevel: user.activity_level,
        restrictions: user.dietary_restrictions || [],
        createdAt: user.created_at,
      };

      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse,
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
  }
);

// User login
authRoutes.post(
  '/login',
  validateLogin,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      ensureSupabaseConfig();

      const { email, password } = req.body as UserLoginData;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database not configured' });
        return;
      }

      // Find user
      const { data: user } = await supabase.from('users').select('*').eq('email', email).single();

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env['JWT_SECRET']!, {
        expiresIn: '7d',
      });

      // Return user data without password
      const userResponse = {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim(),
        age: user.date_of_birth
          ? new Date().getFullYear() - new Date(user.date_of_birth).getFullYear()
          : null,
        weight: user.weight_kg,
        height: user.height_cm ? user.height_cm / 100 : null, // Convert back to meters
        goal: user.fitness_goals ? user.fitness_goals[0] : null,
        activityLevel: user.activity_level,
        restrictions: user.dietary_restrictions || [],
        createdAt: user.created_at,
      };

      res.json({
        message: 'Login successful',
        user: userResponse,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Error during login' });
    }
  }
);

// Get user profile
authRoutes.get(
  '/profile',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      ensureSupabaseConfig();

      if (!req.user?.id) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database not configured' });
        return;
      }

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({ error: 'Error getting profile' });
    }
  }
);

// Update user profile
authRoutes.put(
  '/profile',
  authenticateToken,
  validateProfileUpdate,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      ensureSupabaseConfig();

      if (!req.user?.id) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { name, age, weight, height, goal, activityLevel, restrictions } =
        req.body as UserProfileUpdateData;

      const userData: any = {};
      if (name !== undefined) userData.name = name;
      if (age !== undefined) userData.age = age;
      if (weight !== undefined) userData.weight = weight;
      if (height !== undefined) userData.height = height;
      if (goal !== undefined) userData.goal = goal;
      if (activityLevel !== undefined) userData.activityLevel = activityLevel;
      if (restrictions !== undefined) userData.restrictions = restrictions;

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database not configured' });
        return;
      }

      // Convert data to Supabase format
      const supabaseUpdateData: any = {};

      if (name) {
        const nameParts = name.trim().split(' ');
        supabaseUpdateData.first_name = nameParts[0] || '';
        supabaseUpdateData.last_name = nameParts.slice(1).join(' ') || '';
      }

      if (age) {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - age;
        supabaseUpdateData.date_of_birth = `${birthYear}-01-01`;
      }

      if (weight !== undefined) supabaseUpdateData.weight_kg = weight;
      if (height !== undefined) supabaseUpdateData.height_cm = height ? height * 100 : null;
      if (goal) supabaseUpdateData.fitness_goals = [goal];
      if (activityLevel) supabaseUpdateData.activity_level = activityLevel;
      if (restrictions) supabaseUpdateData.dietary_restrictions = restrictions;

      supabaseUpdateData.updated_at = new Date().toISOString();

      const { data: user } = await supabase
        .from('users')
        .update(supabaseUpdateData)
        .eq('id', req.user.id)
        .select()
        .single();

      res.json({
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Error updating profile' });
    }
  }
);

// Change password
authRoutes.put(
  '/change-password',
  authenticateToken,
  validatePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      ensureSupabaseConfig();

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

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database not configured' });
        return;
      }

      // Get user with password
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);

      if (!isValidPassword) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await supabase
        .from('users')
        .update({ password_hash: hashedNewPassword })
        .eq('id', req.user.id);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Error changing password' });
    }
  }
);

// Delete user account
authRoutes.delete(
  '/account',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      ensureSupabaseConfig();

      if (!req.user?.id) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ error: 'Database not configured' });
        return;
      }

      await supabase.from('users').delete().eq('id', req.user.id);

      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ error: 'Error deleting account' });
    }
  }
);

// Test endpoint to verify Supabase connection
authRoutes.get('/test', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      res.status(500).json({ error: 'Database not configured' });
      return;
    }

    // Try to query the users table
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
      res.json({
        error: 'Supabase connection error',
        details: error.message,
        code: error.code,
        hint: 'This might mean the tables do not exist yet',
      });
      return;
    }

    res.json({
      message: 'Supabase connection successful',
      data,
      supabaseUrl: process.env['SUPABASE_URL'],
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: 'Test failed', details: error });
  }
});
