import mongoose, { Schema, Document } from 'mongoose';
interface IWord {
  text: string;
  timestamp: string;
}

interface IUser extends Document {
  chat_id: number;
  words: IWord[]; 
  name: string;
  createdAt: Date;
}

export{
  IWord,
  IUser
}