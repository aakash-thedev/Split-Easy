import { Document, model, Schema } from "mongoose"

interface IGroup extends Document {
  name: string;
  members: Schema.Types.ObjectId[];
}

const groupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export const Group = model<IGroup>('Group', groupSchema);
