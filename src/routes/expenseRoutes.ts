import { Router } from "express";
import { allExpenses, createExpense, settleExpenses } from "../controllers/expenseController";

const router = Router();

// @route     POST /api/expenses/create
// @desc      Create a new expense
// @access    PRIVATE
router.post('/create', createExpense);

// @route     GET /api/expenses/:groupId/allExpenses
// @desc      Get all expenses
// @access    PRIVATE
router.get('/:groupId/allExpenses', allExpenses);

// @route     GET /api/expenses/:groupId/settleExpenses
// @desc      Settle up all the expenses
// @access    PRIVATE
router.get('/:groupId/settleExpenses', settleExpenses);

export default router;