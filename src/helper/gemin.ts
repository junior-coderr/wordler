// Make sure to include these imports:
import { GoogleGenerativeAI } from "@google/generative-ai";




export const getMeaning = async (word:string):Promise<string | null>=>{ 
  const geminiKey= process.env.GEMINI_KEY;
  const prompt = `Provide only one clear definition and one example sentence for the word "${word}". Include emojis if possible. Format it exactly like this:

  word: the definition here.
  \n
  Example: an example sentence here.

  Do not add any additional meanings, symbols, and asterisks. Avoid any extra information adhere to the format strictly.`;
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