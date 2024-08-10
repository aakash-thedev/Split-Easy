import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { Group } from "../models/Group";
import { geminiProVision, geminiTextPrompt } from "../utils/gemini/gemini-engine";
import { IUser } from "../models/User";
import { isInvalidReceipt, parseAnalysisResult } from "../utils/helpers/expenseHelper";
import fs from 'fs';

// @route     POST /api/expenses/create
// @desc      Create a new expense
// @access    PRIVATE
export const createExpense = async (req: Request, res: Response) => {
  try {
    const { description, amount, paidBy, group, splitBetween } = req.body;
    const expense = new Expense({ description, amount, paidBy, group, splitBetween });
    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// @route     GET /api/expenses/:groupId/allExpenses
// @desc      Get all expenses
// @access    PRIVATE
export const allExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId }).populate('paidBy', 'name').populate('splitBetween', 'name');

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// @route     GET /api/expenses/:groupId/settleExpenses
// @desc      Settle up all the expenses
// @access    PRIVATE
export const settleExpenses = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const allExpenses = await Expense.find({ group: groupId })
      .populate<{ paidBy: IUser }>('paidBy', 'id name')
      .populate<{ splitBetween: IUser[] }>('splitBetween', 'id name');

    const expenseSummary = allExpenses.map(expense => {
      return `${expense.paidBy.name} paid ${expense.amount} for ${expense.description}, shared among ${expense.splitBetween.map(user => user.name).join(', ')}`;
    }).join('. ');

    const prompt = `Here are the group expenses: ${expenseSummary}. Suggest the optimal way to settle these expenses.`;

    const settlementSuggestion = await geminiTextPrompt(prompt);

    res.status(200).json({ settlementSuggestion });

  } catch (error) {
    res.status(500).json({ message: error });
  }
}


export const analysisReceipt = async (req: Request, res: Response) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const prompt = "Analyze this receipt or bill and extract the description, total amount, and type of expense.";
    const imagePath = file.path;

    const analysisResult = await geminiProVision(prompt, imagePath);

    if (isInvalidReceipt(analysisResult)) {
      fs.unlinkSync(imagePath);
      return res.status(400).json({ message: 'It\'s not a valid bill or receipt' });
    }

    const [description, totalAmount, expenseType] = parseAnalysisResult(analysisResult);

    // Clean up the uploaded file
    fs.unlinkSync(imagePath);

    res.status(200).json({
      description,
      total_amount: totalAmount,
      expense_type: expenseType
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}