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
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const sendRes_telegram_1 = __importDefault(require("./sendRes_telegram"));
const db = new better_sqlite3_1.default('wordler.db');
// Initialize the database with the required table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    chat_id INTEGER PRIMARY KEY,
    words TEXT,  -- Storing as JSON-encoded string, expires after 10 seconds
    name TEXT,
    createdAt TEXT
  )
`);
// Function to add or update a word for a user
const addOrUpdateWord = (chatId, word, name) => {
    try {
        // Retrieve existing words for the user
        const user = db.prepare('SELECT words FROM users WHERE chat_id = ?').get(chatId);
        if (user) {
            // User exists, update their words
            const words = JSON.parse(user.words || '[]');
            if (!words.some((w) => (w === null || w === void 0 ? void 0 : w.text) === (word === null || word === void 0 ? void 0 : word.text))) {
                words.push(word);
                console.log("words arr while adding", words);
                db.prepare('UPDATE users SET words = ? WHERE chat_id = ?')
                    .run(JSON.stringify(words), chatId);
            }
        }
        else {
            // New user, insert with the first word
            db.prepare('INSERT INTO users (chat_id, words, name, createdAt) VALUES (?, ?, ?, ?)')
                .run(chatId, JSON.stringify([word]), name, new Date().toISOString());
        }
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.addOrUpdateWord = addOrUpdateWord;
const getWords = (chatId) => {
    const user = db.prepare('SELECT words FROM users WHERE chat_id = ?').get(chatId);
    const words = JSON.parse((user === null || user === void 0 ? void 0 : user.words) || '[]');
    // const wordsText = words.map((word:any)=>word?.text);
    return words;
};
exports.getWords = getWords;
const deleteWords = () => {
    console.log('deleteWords performed');
    try {
        // Calculate 48 hours ago
        const fortyEightHoursAgo = new Date();
        fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
        // Fetch all users from the database
        const users = db.prepare('SELECT * FROM users').all();
        // Process each user's words array
        console.log('users', users);
        users.forEach(user => {
            // Parse the words array (stored as JSON in the database)
            const words = JSON.parse(user.words || '[]');
            // Filter out words older than 48 hours
            const filteredWords = words.filter((w) => {
                console.log(w.timestamp, 'w.timestamp');
                console.log(new Date(w.timestamp), 'new Date(w.timestamp)');
                console.log(fortyEightHoursAgo, 'fortyEightHoursAgo');
                return new Date(w.timestamp) > fortyEightHoursAgo;
            });
            console.log('fiyer', filteredWords);
            // Update the database with the filtered words array
            db.prepare('UPDATE users SET words = ? WHERE chat_id = ?')
                .run(JSON.stringify(filteredWords), user.chat_id);
        });
        const usersAfterDelete = db.prepare('SELECT * FROM users').all();
        usersAfterDelete.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, sendRes_telegram_1.default)(user.chat_id.toString(), 'Words deleted successfully. word function ran');
        }));
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.deleteWords = deleteWords;
const deleteWordFromArray = (wordText, chatId) => {
    try {
        const words = (0, exports.getWords)(chatId);
        console.log(words, 'words');
        let exist = false;
        const newWords = words.filter((w) => {
            if (w.text === wordText) {
                exist = true;
            }
            return w.text !== wordText;
        });
        console.log("new words", newWords);
        db.prepare('UPDATE users SET words = ? WHERE chat_id = ?').run(JSON.stringify(newWords), chatId);
        if (!exist)
            return `🚫 This word isn’t in your list! 📜`;
        return exist;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.deleteWordFromArray = deleteWordFromArray;
const getAllUsers = () => {
    return db.prepare('SELECT * FROM users').all();
};
exports.getAllUsers = getAllUsers;
// Function to retrieve words for a use
exports.default = db;
//# sourceMappingURL=sqllite.js.map