import jwt from 'jsonwebtoken';

// Function to generate a JWT token
export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
};

// Function to verify a JWT token
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
