import express, { Request, response, Response } from "express";
import dotenv from "dotenv";
import cron from "node-cron"
import { getMeaning } from "./helper/gemin";
import { addOrUpdateWord, deleteWordFromArray, deleteWords, getWords } from "./helper/sqllite";
import startRandomJobScheduler from "./helper/IntervalWork";
import sendRes_telegram from "./helper/sendRes_telegram";
import chatWithGemin from "./helper/chat_gemini";
dotenv.config();
const PORT = process.env.PORT || 3000;


const app = express();
// Use express.json() middleware to parse JSON bodies
app.use(express.json());

cron.schedule('0 5 */2 * *', () => {
  console.log('Running task every 2 days at midnight');
  deleteWords();
});

  startRandomJobScheduler();




app.post("/api/bot", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const text= message?.text; // Get the text of the message
    const chat = message?.chat; // Get chat info
    const chatId = chat?.id; // Get chat ID
    const name = chat?.first_name; // Get chat name
    const command = text?.split(" ")[0]; // Get the command
    if(!text){
        res.status(200).json({ status: 'Message processed' });
        return;
    }
    
  // checking command
  switch (command) {
    case "/start":
     
      const responseText = `🎉 Welcome to the Wordler Bot 🤖!
Here, you can easily search for word meanings and set reminders for your favorite words! 📚✨

🛠️ Here’s what you can do:

🔍 /search <word> - Discover the meaning of any word!
⏰ /set <word> - Set a reminder for that word to keep it fresh in your mind!
❌ /rm <word> - Remove a word from your reminders.
📝 /list - View your list of words.

💬 Just type a command to get started, or just chat and let's explore the world of words together! 🌍📖`;

      await sendRes_telegram(chatId,responseText);  
      res.status(200).json({ status: 'Message processed' });
      return;
    case "/search":
      if(!text.split(" ")[1]){
        await sendRes_telegram(chatId,`⚠️ Oops! Please provide a word to search for! 🔍`);
        res.status(200).json({ status: 'Message processed', meaning: "Please provide a word to search for!" });
        return;
      }
      const meaning = await getMeaning(text.split(" ")[1]);
      if(meaning){
        await sendRes_telegram(chatId,meaning);
        res.status(200).json({ status: 'Message processed', meaning });
      }else{
        await sendRes_telegram(chatId,`⚠️ Oops! I don't know this word! 🔍`);
        res.status(200).json({ status: 'Message processed', meaning: "I don't know this word" });
      }
      return;
    case "/set":
      const addWord =  await addOrUpdateWord(chatId, { text: text.split(" ")[1], timestamp: new Date().toISOString() }, name );   
      if(addWord){
        await sendRes_telegram(chatId,`✅ Word added to your list! 📚`);
        res.status(200).json({ status: 'Message processed', addWord });
      }else{
        await sendRes_telegram(chatId,`⚠️ Oops! Something went wrong. Please try again! 🔄`);
        res.status(200).json({ status: 'Message processed', addWord: false });
      }
      return;
    case "/rm":
      const deleteWord =await deleteWordFromArray(text.split(" ")[1], chatId);
      if(typeof deleteWord === "string"){
        await sendRes_telegram(chatId,deleteWord);
        res.status(200).json({ status: 'Message processed', deleteWord });
      }else if(deleteWord){
        await sendRes_telegram(chatId,`🗑️ Word removed from your list! 👍`);
        res.status(200).json({ status: 'Message processed', deleteWord });
      }else{
        await sendRes_telegram(chatId,`⚠️ Oops! Something went wrong. Please try again! 🔄`);
        res.status(200).json({ status: 'Message processed', deleteWord: false });
      }
      return;
    case "/list":
      const list = await getWords(chatId);
      if(list&&list.length > 0){
        await sendRes_telegram(chatId,`📝 Here’s your word list:\n${list.map((w, i) => `${i + 1}. ${w.text} ✨`).join("\n")}`
);
        res.status(200).json({ status: 'Message processed', list });
      }else{
        await sendRes_telegram(chatId,`😅 Oops! Your list is empty. Add some words to get started! 📚✨`);
        res.status(200).json({ status: 'Message processed', list: [] });
      }
      return;
      
  }

  // Send the response back to the user
  const chatWithGeminRes = await chatWithGemin(text);
  if(chatWithGeminRes){
    const result =  await sendRes_telegram(chatId,chatWithGeminRes);    
    console.log('Wordler Bot🤖 is working fine',result);
  }else{
    await sendRes_telegram(chatId,`⚠️ Oops! Something went wrong. Please try again! 🔄`);
  }
  } catch (error) {
    console.log('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  

  // Respond to Telegram's server
  res.status(200).json({ status: 'Message processed' });

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
