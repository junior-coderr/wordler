import express, { Request, response, Response } from "express";
import dotenv from "dotenv";
import { getMeaning } from "./helper/gemin";
import { addOrUpdateWord, deleteWordFromArray, deleteWords } from "./helper/sqllite";
import startRandomJobScheduler from "./helper/IntervalWork";
import cron from "node-cron";
import sendRes_telegram from "./helper/sendRes_telegram";
dotenv.config();



const app = express();
// Use express.json() middleware to parse JSON bodies
app.use(express.json());


// cron.schedule('0 6 */3 * *', () => {
  // deleteWords();
// });
// startRandomJobScheduler();



app.post("/api/bot", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const text= message.text; // Get the text of the message
    const chat = message.chat; // Get chat info
    const chatId = chat.id; // Get chat ID
    const name = chat.first_name; // Get chat name
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
💬 Just type a command to get started, and let's explore the world of words together! 🌍📖`;

      await sendRes_telegram(chatId,responseText);  
      res.status(200).json({ status: 'Message processed' });
      return;
    case "/search":
      const meaning = await getMeaning(text.split(" ")[1]);
      if(meaning){
        await sendRes_telegram(chatId,meaning);
        res.status(200).json({ status: 'Message processed', meaning });
      }else{
        res.status(200).json({ status: 'Message processed', meaning: "I don't know this word" });
      }
      return;
    case "/set":
      const addWord =  addOrUpdateWord(chatId, { text: text.split(" ")[1], timestamp: new Date().toISOString() }, name );   
      if(addWord){
        await sendRes_telegram(chatId,"Word added to your list");
        res.status(200).json({ status: 'Message processed', addWord });
      }else{
        await sendRes_telegram(chatId,"Something went wrong!");
        res.status(200).json({ status: 'Message processed', addWord: false });
      }
      return;
    case "/rm":
      const deleteWord = deleteWordFromArray(text.split(" ")[1], chatId);
      if(typeof deleteWord === "string"){
        await sendRes_telegram(chatId,deleteWord);
        res.status(200).json({ status: 'Message processed', deleteWord });
      }else if(deleteWord){
        await sendRes_telegram(chatId,"Word removed from your list");
        res.status(200).json({ status: 'Message processed', deleteWord });
      }else{
        await sendRes_telegram(chatId,"Something went wrong!");
        res.status(200).json({ status: 'Message processed', deleteWord: false });
      }
      return;
      
  }

  // Send the response back to the user

  const result =  await sendRes_telegram(chatId,"Wordler Bot🤖 is working fine");    
  console.log('Wordler Bot🤖 is working fine',result);
   
  } catch (error) {
    console.log('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  

  // Respond to Telegram's server
  res.status(200).json({ status: 'Message processed' });

});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
