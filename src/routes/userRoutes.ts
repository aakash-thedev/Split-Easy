import { Router } from "express";
import { allUsers, details, login, register } from "../controllers/userController";
import { protect } from "../middlewares/auth";

const router = Router();

// @route     POST /api/users/register
// @desc      Register a user
// @access    PUBLIC
router.post('/register', register);

// @route     POST /api/users/login
// @desc      Login user
// @access    PUBLIC
router.post('/login', login);

// @route     GET /api/users/allUsers
// @desc      Fetch all users
// @access    PRIVATE
router.get('/allUsers', protect, allUsers);

// @route     GET /api/users/:id/details
// @desc      Fetch user details
// @access    PRIVATE
router.get('/:id/details', protect, details);

export default router;