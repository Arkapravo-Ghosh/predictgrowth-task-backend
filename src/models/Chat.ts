import { Schema, model, Document, Types } from "mongoose";

export interface IMessage {
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  user: Types.ObjectId;
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "model"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new Schema<IChat>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  messages: [MessageSchema],
});

export default model<IChat>("Chat", ChatSchema);
