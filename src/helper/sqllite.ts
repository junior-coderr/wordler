import Database from 'better-sqlite3';
import sendRes_telegram from './sendRes_telegram';

const db = new Database('wordler.db');

// Initialize the database with the required table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    chat_id INTEGER PRIMARY KEY,
    words TEXT,  -- Storing as JSON-encoded string, expires after 10 seconds
    name TEXT,
    createdAt TEXT
  )
`);

interface User {
  words: string;
  createdAt: string; // Added createdAt property
}

// Function to add or update a word for a user
export const addOrUpdateWord = (chatId: number, word: { text: string, timestamp: string }, name: string): boolean => {
  try {
    // Retrieve existing words for the user
    const user = db.prepare<User>('SELECT words FROM users WHERE chat_id = ?').get(chatId as unknown as User) as User | undefined;
    
    if (user) {
      // User exists, update their words
      const words: { text: string, timestamp: string }[] = JSON.parse(user.words || '[]');
      if (!words.some((w:any) => w?.text === word?.text)) {
        words.push(word);
        console.log("words arr while adding",words);
        db.prepare('UPDATE users SET words = ? WHERE chat_id = ?')
          .run(JSON.stringify(words), chatId);
      }
    } else {
      // New user, insert with the first word
      db.prepare('INSERT INTO users (chat_id, words, name, createdAt) VALUES (?, ?, ?, ?)')
        .run(chatId, JSON.stringify([word]), name, new Date().toISOString());
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getWords = (chatId: number): { text: string, timestamp: string }[] => {
  const user = db.prepare<User>('SELECT words FROM users WHERE chat_id = ?').get(chatId as unknown as User) as User | undefined;
  const words = JSON.parse(user?.words || '[]');
  // const wordsText = words.map((word:any)=>word?.text);
  return words;
};
type Users = {
  chat_id: number;
  words: string; // JSON string containing an array of word objects with timestamps
  name: string;
  createdAt: string;
};

export const deleteWords = (): boolean => {
  console.log('deleteWords performed')
  try {  
    // Calculate 48 hours ago
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    // Fetch all users from the database
    const users = db.prepare('SELECT * FROM users').all() as Users[];

    // Process each user's words array
    console.log('users', users)
    users.forEach(user => {
      // Parse the words array (stored as JSON in the database)
      const words = JSON.parse(user.words || '[]') as { text: string; timestamp: string }[];

      // Filter out words older than 48 hours
      const filteredWords = words.filter(
        (w: any) => {
          console.log(w.timestamp, 'w.timestamp');
          console.log(new Date(w.timestamp), 'new Date(w.timestamp)');
          console.log(fortyEightHoursAgo, 'fortyEightHoursAgo');
          return new Date(w.timestamp) > fortyEightHoursAgo
        }
      );

      console.log('fiyer',filteredWords);

      // Update the database with the filtered words array
      db.prepare('UPDATE users SET words = ? WHERE chat_id = ?')
        .run(JSON.stringify(filteredWords), user.chat_id);
    });
    const usersAfterDelete = db.prepare('SELECT * FROM users').all() as Users[];
    usersAfterDelete.forEach(async (user:Users)=>{
      await sendRes_telegram(user.chat_id.toString(),'Words deleted successfully. word function ran');
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};


export const deleteWordFromArray = (wordText: string, chatId: number): string | boolean => {
  try {
    const words = getWords(chatId);
    console.log(words,'words');
    let exist = false;
    const newWords = words.filter((w:any) =>{
      if(w.text === wordText){
        exist = true;
      }
      return w.text !== wordText;
    });
    console.log("new words",newWords);
    db.prepare('UPDATE users SET words = ? WHERE chat_id = ?').run(JSON.stringify(newWords), chatId);
    if(!exist) return `🚫 This word isn’t in your list! 📜`;
    return exist;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const getAllUsers = (): User[] => {
  return db.prepare('SELECT * FROM users').all() as User[];
};

// Function to retrieve words for a use
export default db;
