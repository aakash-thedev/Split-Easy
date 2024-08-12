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
exports.analysisReceipt = exports.settleExpenses = exports.allExpenses = exports.createExpense = void 0;
const Expense_1 = require("../models/Expense");
const Group_1 = require("../models/Group");
const gemini_engine_1 = require("../utils/gemini/gemini-engine");
const expenseHelper_1 = require("../utils/helpers/expenseHelper");
const fs_1 = __importDefault(require("fs"));
const GroupSettlementResult_1 = require("../models/GroupSettlementResult");
// @route     POST /api/expenses/create
// @desc      Create a new expense
// @access    PRIVATE
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, amount, group, isEqualSplit, customAmounts } = req.body;
        const paidBy = req.user.id;
        const splitBetween = req.body.splitBetween.map((user) => user._id);
        // Create a new expense object based on whether the split is equal or unequal
        const expenseData = {
            name,
            description,
            amount,
            paidBy,
            group,
            splitBetween,
            isEqualSplit,
            customAmounts: isEqualSplit ? {} : new Map(Object.entries(customAmounts)),
        };
        const expense = new Expense_1.Expense(expenseData);
        yield expense.save();
        res.status(201).json({ message: 'New expense created' });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.createExpense = createExpense;
// @route     GET /api/expenses/:groupId/allExpenses
// @desc      Get all expenses
// @access    PRIVATE
const allExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield Expense_1.Expense.find({ group: req.params.groupId }).populate('paidBy', 'name').populate('splitBetween', 'name');
        res.json(expenses);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.allExpenses = allExpenses;
// @route     GET /api/expenses/:groupId/settleExpenses
// @desc      Settle up all the expenses
// @access    PRIVATE
const settleExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupId } = req.params;
        const group = yield Group_1.Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const groupResult = yield GroupSettlementResult_1.GroupSettlementResult.findOne({ group: groupId });
        if (groupResult) {
            return res.status(200).json({ settlementSuggestion: groupResult.result });
        }
        const allExpenses = yield Expense_1.Expense.find({ group: groupId })
            .populate('paidBy', 'id name')
            .populate('splitBetween', 'id name');
        const expenseSummary = allExpenses.map(expense => {
            if (expense.isEqualSplit) {
                return `${expense.paidBy.name} paid ${expense.amount} for ${expense.description}, shared equally among ${expense.splitBetween.map(user => user.name).join(', ')}`;
            }
            else {
                const customAmounts = expense.splitBetween.map(user => {
                    const amount = expense.customAmounts.get(user.id.toString());
                    return `${user.name} owes ${amount}`;
                }).join(', ');
                return `${expense.paidBy.name} paid ${expense.amount} for ${expense.description}, shared unequally: ${customAmounts}`;
            }
        }).join('. ');
        const prompt = `Here are the group expenses: ${expenseSummary}. Suggest the optimal way to settle these expenses.
    Only give the split explanation like who has give give whom how much ?
    Also return the response as a html code so that i could just render it on frontend without worrying about styles,
    ignore tags like html head etc just divs and make sure to use bold colors for user names and grey colors remaining text.
    Make sure to keep the user name with color rgb(95, 177, 248) and each line should be spaced with 4px gap, keep the color of amount red`;
        const settlementSuggestion = yield (0, gemini_engine_1.geminiTextPrompt)(prompt);
        yield GroupSettlementResult_1.GroupSettlementResult.create({ group: groupId, result: settlementSuggestion });
        res.status(200).json({ settlementSuggestion });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.settleExpenses = settleExpenses;
const analysisReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const prompt = "Analyze this receipt or bill and extract the description, total amount, and type of expense.";
        const imagePath = file.path;
        const analysisResult = yield (0, gemini_engine_1.geminiProVision)(prompt, imagePath);
        if ((0, expenseHelper_1.isInvalidReceipt)(analysisResult)) {
            fs_1.default.unlinkSync(imagePath);
            return res.status(400).json({ message: 'It\'s not a valid bill or receipt' });
        }
        const [description, totalAmount, expenseType] = (0, expenseHelper_1.parseAnalysisResult)(analysisResult);
        // Clean up the uploaded file
        fs_1.default.unlinkSync(imagePath);
        res.status(200).json({
            description,
            total_amount: totalAmount,
            expense_type: expenseType
        });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.analysisReceipt = analysisReceipt;
