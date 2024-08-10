import { Request, Response } from "express";
import { User } from "../models/User";

// @route     POST /api/users/register
// @desc      Register a user
// @access    PUBLIC
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(401).json({ message: 'User with provided email already exist' });
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).json({ user: newUser });

  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

// @route     POST /api/users/login
// @desc      Login user
// @access    PUBLIC
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ user: user, message: 'Logged in successfully' });

  } catch (error) {
    console.log("Error logging in user", error);
    res.status(500).json({ error: 'Login failed' });
  }
}

// @route     GET /api/users/:id/details
// @desc      Fetch user details
// @access    PRIVATE
export const details = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: user, message: 'User details' });

  } catch (error) {
    console.log("Error fetching details", error);
    res.status(500).json({ error: 'Login failed' });
  }
}