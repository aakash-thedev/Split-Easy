import { Document, model, Schema } from "mongoose"

interface IGroup extends Document {
  name: string;
  description: string;
  coverImageUrl: string;
  members: Schema.Types.ObjectId[];
}

const groupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  description: { type: String },
  coverImageUrl: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export const Group = model<IGroup>('Group', groupSchema);
