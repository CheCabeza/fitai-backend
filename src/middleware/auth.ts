import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTPayload } from '../types';

const prisma = new PrismaClient();

// Middleware to verify JWT token
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as JWTPayload;

    // Verify user exists in database
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }

    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Optional middleware for routes that can work with or without authentication
export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as JWTPayload;
      const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
      });
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // If there's an error with the token, just continue without user
    next();
  }
};
