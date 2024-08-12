"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAi = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
dotenv_1.default.config();
exports.genAi = new generative_ai_1.GoogleGenerativeAI("AIzaSyDZUa7FnxK-OUPoHjtQigbn2gHRpiE8aXw");
