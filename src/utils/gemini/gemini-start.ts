import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

export const genAi = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_API_KEY as string);