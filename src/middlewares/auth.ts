import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extending the Express Request interface to include the user property
export interface AuthRequest extends Request {
  user?: any;
}

// Middleware to protect routes and ensure only authenticated users can access them
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  try {
    // Verify the token and attach the user to the request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = await User.findById(decoded.id).select('-password');
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};
