import sendRes_telegram from './sendRes_telegram';
import User,{userSchema} from './models/user';
import { IWord,IUser } from './types/schema.types';
import connectDB from './db/connect.db';

// Connect to MongoDB

// // Define User Schema
// interface IWord {
//   text: string;
//   timestamp: string;
// }

// interface IUser extends Document {
//   chat_id: number;
//   words: IWord[];
//   name: string;
//   createdAt: Date;
// }

// const userSchema = new Schema<IUser>({
//   chat_id: { type: Number, required: true, unique: true },
//   words: [
//     {
//       text: { type: String, required: true },
//       timestamp: { type: String, default: Date.now }
//     }
//   ],
//   name: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// const User = mongoose.model<IUser>('User', userSchema);

// Function to add or update a word for a user
export const addOrUpdateWord = async (chatId: number, word: IWord, name: string): Promise<boolean> => {
  try {
    await connectDB();
    const user = await User.findOne({ chat_id: chatId }) as IUser;

    if (user) {
      // User exists, update their words
      if (!user.words.some(w => w.text === word.text)) {
        user.words.push(word);
        await user.save();
      }
    } else {
      // New user, insert with the first word
      await User.create({
        chat_id: chatId,
        words: [word],
        name,
        createdAt: new Date()
      });
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Function to retrieve words for a user
export const getWords = async (chatId: number): Promise<IWord[] | null> => {
  try {
    
    await connectDB();
    const user = await User.findOne({ chat_id: chatId });
    return user?.words || [];
  } catch (error) {
    console.log('error somewere!',error);
   return null 
  }
};

// Function to delete words older than 48 hours
export const deleteWords = async (): Promise<boolean | null> => {
  try {
    await connectDB();
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const users = await User.find();

    for (const user of users) {
      // Filter out words older than 48 hours
      const filteredWords = user.words.filter(
        w => new Date(w.timestamp) > fortyEightHoursAgo
      );

      // Update the user's words if they have changed
      if (filteredWords.length !== user.words.length) {
        user.words = filteredWords;
        await user.save();

        // Send notification after deletion
        await sendRes_telegram(user.chat_id.toString(), 'Words deleted successfully. word function ran');
      }
    }
    return true;
  } catch (error) {
    console.log('error somewhere!',error);
    return null;
  }
};

// Function to delete a specific word for a user
export const deleteWordFromArray = async (wordText: string, chatId: number): Promise<string | boolean | null> => {
  try {
    await connectDB();
   const user = await User.findOne({ chat_id: chatId });
    if (!user) return `🚫 User not found! 📜`;

    const newWords = user.words.filter(w => w.text !== wordText);
    if (newWords.length === user.words.length) return `🚫 This word isn’t in your list! 📜`;

    user.words = newWords;
    await user.save();
    return true;
  } catch (error) {
    console.log('error in deleting ',error);
    return null;
  }
};

// Function to get all users
export const getAllUsers = async (): Promise<IUser[] | null> => {
  try {
    await connectDB();
    return await User.find();
  } catch (error) {
    console.log('error getting all the users',error)
    return null;
  }
};
