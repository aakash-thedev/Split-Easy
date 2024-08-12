"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// @route     POST /api/users/register
// @desc      Register a user
// @access    PUBLIC
router.post('/register', userController_1.register);
// @route     POST /api/users/login
// @desc      Login user
// @access    PUBLIC
router.post('/login', userController_1.login);
// @route     GET /api/users/allUsers
// @desc      Fetch all users
// @access    PRIVATE
router.get('/allUsers', auth_1.protect, userController_1.allUsers);
// @route     GET /api/users/:id/details
// @desc      Fetch user details
// @access    PRIVATE
router.get('/:id/details', auth_1.protect, userController_1.details);
exports.default = router;
