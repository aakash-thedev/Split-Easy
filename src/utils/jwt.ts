import jwt from 'jsonwebtoken';

// Function to generate a JWT token
export const generateToken = (id: string) => {
  console.log("TOKEN USER ID", id);
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

// Function to verify a JWT token
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
