"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.details = exports.allUsers = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
// @route     POST /api/users/register
// @desc      Register a user
// @access    PUBLIC
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("REGISTER API HIT", req.body);
        const { name, email, password } = req.body;
        const user = yield User_1.default.findOne({ email: email });
        if (user) {
            return res.status(401).json({ message: 'User with provided email already exist' });
        }
        const newUser = yield User_1.default.create({ name, email, password });
        // Generate a JWT token for the user
        const token = (0, jwt_1.generateToken)(newUser.id);
        res.status(201).json({ jwtToken: token, user: newUser, message: 'User Registered successfully' });
    }
    catch (error) {
        console.log("Error registering user", error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
exports.register = register;
// @route     POST /api/users/login
// @desc      Login user
// @access    PUBLIC
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const isPasswordValid = yield user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = (0, jwt_1.generateToken)(user.id);
        res.status(200).json({ jwtToken: token, user: user, message: 'Logged in successfully' });
    }
    catch (error) {
        console.log("Error logging in user", error);
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.login = login;
// @route     GET /api/users/allUsers
// @desc      Fetch users
// @access    PRIVATE
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({ _id: { $ne: req.user.id } }).select('id, name');
        res.status(200).json({ users: users, message: 'All Users' });
    }
    catch (error) {
        console.log("Error fetching details", error);
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.allUsers = allUsers;
// @route     GET /api/users/:id/details
// @desc      Fetch user details
// @access    PRIVATE
const details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: user, message: 'User details' });
    }
    catch (error) {
        console.log("Error fetching details", error);
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.details = details;
