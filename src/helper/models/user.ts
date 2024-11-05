// models/User.ts

import mongoose, { Schema, Document } from 'mongoose';

// Define a TypeScript interface for the Word object
interface IWord {
  text: string;
  timestamp: string;
}

// Define a TypeScript interface for the User document
export interface IUser extends Document {
  chat_id: number;
  words: IWord[];
  name: string;
  createdAt: Date;
}

// Create the User schema
export const userSchema = new Schema<IUser>({
  chat_id: { type: Number, required: true, unique: true },
  words: [
    {
      text: { type: String, required: true },
      timestamp: { type: String, required: true }
    }
  ],
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;

