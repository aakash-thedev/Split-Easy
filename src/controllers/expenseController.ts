import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { Group } from "../models/Group";
import { geminiProVision, geminiTextPrompt } from "../utils/gemini/gemini-engine";
import { IUser } from "../models/User";
import { isInvalidReceipt, parseAnalysisResult } from "../utils/helpers/expenseHelper";
import fs from 'fs';
import { AuthRequest } from "../middlewares/auth";
import { GroupSettlementResult } from "../models/GroupSettlementResult";

// @route     POST /api/expenses/create
// @desc      Create a new expense
// @access    PRIVATE
export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, amount, group, isEqualSplit, customAmounts } = req.body;
    const paidBy = req.user.id;
    const splitBetween = req.body.splitBetween.map((user: any) => user._id);

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

    const expense = new Expense(expenseData);
    await expense.save();

    res.status(201).json({ message: 'New expense created' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};


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

    const groupResult = await GroupSettlementResult.findOne({ group: groupId });

    if (groupResult) {
      return res.status(200).json({ settlementSuggestion: groupResult.result });
    }

    const allExpenses = await Expense.find({ group: groupId })
      .populate<{ paidBy: IUser }>('paidBy', 'id name')
      .populate<{ splitBetween: IUser[] }>('splitBetween', 'id name');

    const expenseSummary = allExpenses.map(expense => {
      if (expense.isEqualSplit) {
        return `${expense.paidBy.name} paid ${expense.amount} for ${expense.description}, shared equally among ${expense.splitBetween.map(user => user.name).join(', ')}`;
      } else {
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

    const settlementSuggestion = await geminiTextPrompt(prompt);
    await GroupSettlementResult.create({ group: groupId, result: settlementSuggestion });

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