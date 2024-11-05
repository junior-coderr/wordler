import dotenv from "dotenv";
dotenv.config();
import mongoose, { Schema, Document } from 'mongoose';
const uri = process.env.MONGO_URL || '';


export default async function connectDB (){
  try {
    await mongoose.connect(uri)
    console.log('connected to db!')
    return true;
  } catch (error) {
    console.log('error connecting db!');
    throw new Error("MongoDB connection error: " + error); 
  }
}