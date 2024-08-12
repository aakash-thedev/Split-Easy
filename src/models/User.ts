import { Schema, Document, model } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  avatar: string;
  password: string;
  validatePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  password: { type: String, required: true }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.validatePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
}

const User = model<IUser>('User', userSchema);

export default User;
