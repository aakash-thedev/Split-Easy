import { Schema, model, Document } from 'mongoose';

interface IExpense extends Document {
  description: string;
  amount: number;
  paidBy: Schema.Types.ObjectId;
  group: Schema.Types.ObjectId;
  splitBetween: Schema.Types.ObjectId[];
}

const expenseSchema = new Schema<IExpense>({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  splitBetween: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export const Expense = model<IExpense>('Expense', expenseSchema);
