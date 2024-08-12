"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiTextPrompt = geminiTextPrompt;
exports.geminiProVision = geminiProVision;
exports.geminiChat = geminiChat;
exports.geminiStreamLine = geminiStreamLine;
const fs = __importStar(require("fs"));
const readline_1 = __importDefault(require("readline"));
const gemini_start_1 = require("./gemini-start");
// GEMINI PRO
function geminiTextPrompt(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = gemini_start_1.genAi.getGenerativeModel({ model: 'gemini-pro' });
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        const text = response.text();
        return text;
    });
}
// GEMINI VISION PRO
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        }
    };
}
function geminiProVision(prompt, imagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = gemini_start_1.genAi.getGenerativeModel({ model: 'gemini-pro-vision' });
        const imageParts = [fileToGenerativePart(imagePath, 'image/jpeg')];
        const result = yield model.generateContent([prompt, ...imageParts]);
        const response = yield result.response;
        const text = response.text();
        return text;
    });
}
// GEMINI CHAT
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
function geminiChat() {
    return __awaiter(this, void 0, void 0, function* () {
        const model = gemini_start_1.genAi.getGenerativeModel({ model: 'gemini-pro' });
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500
            }
        });
        function askAndRespond() {
            return __awaiter(this, void 0, void 0, function* () {
                rl.question("You: ", (message) => __awaiter(this, void 0, void 0, function* () {
                    if (message === 'exit') {
                        rl.close();
                    }
                    else {
                        const result = yield chat.sendMessage(message);
                        const response = yield result.response;
                        const text = yield response.text();
                        return text;
                    }
                }));
            });
        }
        askAndRespond();
    });
}
// STREAMLINE GEMINI CHAT ( Like in actual chat gpt and other ai tools )
let isAwaitingResponse = false; // flag to indicate if we are waiting for a response
function geminiStreamLine() {
    return __awaiter(this, void 0, void 0, function* () {
        const model = gemini_start_1.genAi.getGenerativeModel({ model: 'gemini-pro' });
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500
            }
        });
        function askAndRespond() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isAwaitingResponse) {
                    rl.question("You: ", (message) => __awaiter(this, void 0, void 0, function* () {
                        var _a, e_1, _b, _c;
                        if (message === 'exit') {
                            rl.close();
                        }
                        else {
                            isAwaitingResponse = true;
                            try {
                                const result = yield chat.sendMessageStream(message);
                                let text = "";
                                try {
                                    for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                                        _c = _f.value;
                                        _d = false;
                                        const chunk = _c;
                                        const chunkText = yield chunk.text();
                                        console.log("AI : ", chunkText);
                                        text += chunkText;
                                    }
                                }
                                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                finally {
                                    try {
                                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                }
                                isAwaitingResponse = false;
                                askAndRespond();
                            }
                            catch (error) {
                                console.log("Error : ", error);
                                isAwaitingResponse = false;
                            }
                        }
                    }));
                }
                else {
                    console.log("Please Wait for response to complete");
                }
            });
        }
        askAndRespond();
    });
}
