"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.deleteWordFromArray = exports.deleteWords = exports.getWords = exports.addOrUpdateWord = void 0;
const sendRes_telegram_1 = __importDefault(require("./sendRes_telegram"));
const user_1 = __importDefault(require("./models/user"));
const connect_db_1 = __importDefault(require("./db/connect.db"));
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
const addOrUpdateWord = (chatId, word, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_db_1.default)();
        const user = yield user_1.default.findOne({ chat_id: chatId });
        if (user) {
            // User exists, update their words
            if (!user.words.some(w => w.text === word.text)) {
                user.words.push(word);
                yield user.save();
            }
        }
        else {
            // New user, insert with the first word
            yield user_1.default.create({
                chat_id: chatId,
                words: [word],
                name,
                createdAt: new Date()
            });
        }
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
exports.addOrUpdateWord = addOrUpdateWord;
// Function to retrieve words for a user
const getWords = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_db_1.default)();
        const user = yield user_1.default.findOne({ chat_id: chatId });
        return (user === null || user === void 0 ? void 0 : user.words) || [];
    }
    catch (error) {
        console.log('error somewere!', error);
        return null;
    }
});
exports.getWords = getWords;
// Function to delete words older than 48 hours
const deleteWords = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_db_1.default)();
        const fortyEightHoursAgo = new Date();
        fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
        const users = yield user_1.default.find();
        for (const user of users) {
            // Filter out words older than 48 hours
            const filteredWords = user.words.filter(w => new Date(w.timestamp) > fortyEightHoursAgo);
            // Update the user's words if they have changed
            if (filteredWords.length !== user.words.length) {
                user.words = filteredWords;
                yield user.save();
                // Send notification after deletion
                yield (0, sendRes_telegram_1.default)(user.chat_id.toString(), 'Words deleted successfully. word function ran');
            }
        }
        return true;
    }
    catch (error) {
        console.log('error somewhere!', error);
        return null;
    }
});
exports.deleteWords = deleteWords;
// Function to delete a specific word for a user
const deleteWordFromArray = (wordText, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_db_1.default)();
        const user = yield user_1.default.findOne({ chat_id: chatId });
        if (!user)
            return `🚫 User not found! 📜`;
        const newWords = user.words.filter(w => w.text !== wordText);
        if (newWords.length === user.words.length)
            return `🚫 This word isn’t in your list! 📜`;
        user.words = newWords;
        yield user.save();
        return true;
    }
    catch (error) {
        console.log('error in deleting ', error);
        return null;
    }
});
exports.deleteWordFromArray = deleteWordFromArray;
// Function to get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_db_1.default)();
        return yield user_1.default.find();
    }
    catch (error) {
        console.log('error getting all the users', error);
        return null;
    }
});
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=sqllite.js.map