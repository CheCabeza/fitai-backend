import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiResponseExpress, AuthenticatedRequest, UserLoginData } from '../types';

const prisma = new PrismaClient();

// User registration
const register = async (req: AuthenticatedRequest, res: ApiResponseExpress): Promise<void> => {
  try {
    const {
      email,
      password,
      name,
      age,
      weight,
      height,
      goal,
      activityLevel,
      restrictions,
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ success: false, error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData: any = {
      email,
      password: hashedPassword,
      name,
      restrictions: restrictions || [],
    };

    // Add optional fields only if they are defined
    if (age !== undefined) userData.age = age;
    if (weight !== undefined) userData.weight = weight;
    if (height !== undefined) userData.height = height;
    if (goal !== undefined) userData.goal = goal;
    if (activityLevel !== undefined) userData.activityLevel = activityLevel;

    const user = await prisma.users.create({
      data: userData,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env['JWT_SECRET'] || 'fallback-secret',
      { expiresIn: '7d' },
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userWithoutPassword, token },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// User login
const login = async (req: { body: UserLoginData }, res: ApiResponseExpress): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(400).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env['JWT_SECRET'] || 'fallback-secret',
      { expiresIn: '7d' },
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: userWithoutPassword, token },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export {
  login, register
};

