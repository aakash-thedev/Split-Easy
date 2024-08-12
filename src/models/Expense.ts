import { Schema, model, Document } from 'mongoose';

interface IExpense extends Document {
  name: string;
  amount: number;
  paidBy: Schema.Types.ObjectId;
  group: Schema.Types.ObjectId;
  splitBetween: Schema.Types.ObjectId[];
  isEqualSplit: boolean;
  customAmounts: Map<string, number>; // Map of userId -> custom amount for unequal splits
}

const expenseSchema = new Schema<IExpense>({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  splitBetween: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isEqualSplit: { type: Boolean, default: true },
  customAmounts: { type: Map, of: Number }, // Holds the custom amounts for each user
}, {
  timestamps: true
});

export const Expense = model<IExpense>('Expense', expenseSchema);
