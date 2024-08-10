import { Router } from "express";
import { details, login, register } from "../controllers/userController";

const router = Router();

// @route     POST /api/users/register
// @desc      Register a user
// @access    PUBLIC
router.post('/register', register);

// @route     POST /api/users/login
// @desc      Login user
// @access    PUBLIC
router.post('/login', login);

// @route     GET /api/users/:id/details
// @desc      Fetch user details
// @access    PRIVATE
router.get('/:id/details', details);

export default router;