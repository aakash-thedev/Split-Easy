import { Router } from "express";
import multer from 'multer';
import { allExpenses, analysisReceipt, createExpense, settleExpenses } from "../controllers/expenseController";

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

// @route     POST /api/expenses/:groupId/analyzeReceipt
// @desc      Analyze the receipt / bills
// @access    PRIVATE
router.get('/:groupId/analyzeReceipt', analysisReceipt);

export default router;