import { Schema, model, Document } from 'mongoose';

interface IGroupSettlementResult extends Document {
  result: string;
  group: Schema.Types.ObjectId;
}

const groupSettlementResult = new Schema<IGroupSettlementResult>({
  result: { type: String, required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group' }
}, {
  timestamps: true
});

export const GroupSettlementResult = model<IGroupSettlementResult>('GroupSettlementResult', groupSettlementResult);
