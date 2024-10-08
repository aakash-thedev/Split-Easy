import { Document, model, Schema } from "mongoose"

interface IGroup extends Document {
  name: string;
  description: string;
  coverImageUrl: string;
  categories: string[];
  members: Schema.Types.ObjectId[];
}

const groupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  description: { type: String },
  coverImageUrl: { type: String },
  categories: [{ type: String }],
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

export const Group = model<IGroup>('Group', groupSchema);
