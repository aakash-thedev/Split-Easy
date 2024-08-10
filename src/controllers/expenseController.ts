import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { Group } from "../models/Group";

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

  interface IUserBalance {
    userId: string;
    amountOwed: number;
    amountOwes: number;
  }

  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const allExpenses = await Expense.find({ group: groupId }).populate('paidBy', 'id, name').populate('splitBetween', 'id, name');

    // Initialise balances

    const balances: Record<string, IUserBalance> = {};

    allExpenses.forEach((expense) => {
      const splitAmount = expense.amount / expense.splitBetween.length;

    })
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
