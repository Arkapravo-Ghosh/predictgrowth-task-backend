import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  company?: string;
  company_description?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  company: { type: String },
  company_description: { type: String },
});

export default mongoose.model<IUser>("User", UserSchema);
