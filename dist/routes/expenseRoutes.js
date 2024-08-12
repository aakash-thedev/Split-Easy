"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseController_1 = require("../controllers/expenseController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// @route     POST /api/expenses/create
// @desc      Create a new expense
// @access    PRIVATE
router.post('/create', auth_1.protect, expenseController_1.createExpense);
// @route     GET /api/expenses/:groupId/allExpenses
// @desc      Get all expenses
// @access    PRIVATE
router.get('/:groupId/allExpenses', auth_1.protect, expenseController_1.allExpenses);
// @route     GET /api/expenses/:groupId/settleExpenses
// @desc      Settle up all the expenses
// @access    PRIVATE
router.get('/:groupId/settleExpenses', auth_1.protect, expenseController_1.settleExpenses);
// @route     POST /api/expenses/:groupId/analyzeReceipt
// @desc      Analyze the receipt / bills
// @access    PRIVATE
router.get('/:groupId/analyzeReceipt', auth_1.protect, expenseController_1.analysisReceipt);
exports.default = router;
