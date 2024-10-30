// Answer the following question in one short sentence with relevant emojis. Do not use any symbols other than emojis. Keep it simple and clear.

// Make sure to include these imports:
import { GoogleGenerativeAI } from "@google/generative-ai";




export default async function chatWithGemin(question:string):Promise<string | null>{ 
  const geminiKey= process.env.GEMINI_KEY;
  const prompt = `chat in one short sentence with relevant emojis and  words. Do not use any symbols other than emojis. Keep it simple and clear.
  Question: ${question}`;
  try{
    if(!geminiKey) return null
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    console.log(result.response.text(),'result');
    return result.response.text();
  } catch (error) {
    console.log(error);
    return null;
  }
} 