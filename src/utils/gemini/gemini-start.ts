import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

export const genAi = new GoogleGenerativeAI("AIzaSyDZUa7FnxK-OUPoHjtQigbn2gHRpiE8aXw");