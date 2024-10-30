import db from "./sqllite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import sendRes_telegram from "./sendRes_telegram";

dotenv.config();
const getMeaning = async (words: string[]): Promise<string | null> => { 
  const geminiKey = process.env.GEMINI_KEY;

  const prompt = `Provide the definitions and example sentences for each word in this list: [${words.join(", ")}]. Format each entry exactly like this: "1. word: definition. Example: example sentence." Ensure there are no symbols, including asterisks or any other formatting. For example:
  
  Example:
  1. good: morally excellent.
  Example: "She is a good person."

  2. nice: morally excellent.
  Example: "She is a nice person."

  Now provide definitions and examples for each word in the list in the same format, starting from 1.`;

  try {
    if (!geminiKey) return null;
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.log(error);
    return null;
  }
};



const sendRemainder = async ():Promise<boolean>=>{

  try{
    const users = db.prepare('SELECT * FROM users').all();

    users.forEach(async (user:any)=>{
      const words = JSON.parse(user.words);
      const wordsText = words.map((word:any)=>word.text);
      console.log(wordsText,'wordsText');
      const chatId = user.chat_id;
      if(wordsText.length>0){
        const meaning = await getMeaning(wordsText);
        const responseText = `Here are the meanings of the words you set as reminders: \n\n${meaning}`;
        console.log(responseText,'responseText');
        await sendRes_telegram(chatId,responseText);
      }else{
        console.log('no words to send, list is empty',user);
        await sendRes_telegram(chatId,'You have no words set as reminders.');

      }
    });
    return true;
  } catch (error) {
    console.log('error in sendRemainder',error);
    return false;
  }


}

export default sendRemainder;