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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Middleware to protect routes and ensure only authenticated users can access them
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get the token from the Authorization header
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Not authorized' });
    }
    try {
        // Verify the token and attach the user to the request object
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = yield User_1.default.findById(decoded.id).select('-password');
        next(); // Move to the next middleware or route handler
    }
    catch (error) {
        res.status(401).json({ error: 'Not authorized' });
    }
});
exports.protect = protect;
