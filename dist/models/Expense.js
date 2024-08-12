"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
const mongoose_1 = require("mongoose");
const expenseSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Group', required: true },
    splitBetween: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    isEqualSplit: { type: Boolean, default: true },
    customAmounts: { type: Map, of: Number }, // Holds the custom amounts for each user
}, {
    timestamps: true
});
exports.Expense = (0, mongoose_1.model)('Expense', expenseSchema);
