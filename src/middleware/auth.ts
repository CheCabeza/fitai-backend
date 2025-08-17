import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getSupabase } from '../config/supabase';

// Local interfaces for this file
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    id: string;
    email: string;
  };
}

interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Middleware to verify JWT token
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as JWTPayload;

    const supabase = getSupabase();
    if (!supabase) {
      res.status(500).json({ error: 'Database not configured' });
      return;
    }

    // Verify user exists in database
    const { data: user } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', decoded.userId)
      .single();

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = {
      userId: user.id,
      id: user.id,
      email: user.email,
    };
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
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as JWTPayload;
      const supabase = getSupabase();
      if (supabase) {
        const { data: user } = await supabase
          .from('users')
          .select('id, email')
          .eq('id', decoded.userId)
          .single();
        if (user) {
          req.user = {
            userId: user.id,
            id: user.id,
            email: user.email,
          };
        }
      }
    }
    next();
  } catch (_error) {
    // If there's an error with the token, just continue without user
    next();
  }
};
