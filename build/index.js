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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const gemin_1 = require("./helper/gemin");
const sqllite_1 = require("./helper/sqllite");
const sendRes_telegram_1 = __importDefault(require("./helper/sendRes_telegram"));
const chat_gemini_1 = __importDefault(require("./helper/chat_gemini"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const IntervalWork_1 = require("./helper/IntervalWork");
const app = (0, express_1.default)();
// Use express.json() middleware to parse JSON bodies
app.use(express_1.default.json());
node_cron_1.default.schedule('0 5 */2 * *', () => {
    console.log('Running task every 2 days at midnight');
    (0, sqllite_1.deleteWords)();
});
// Schedule jobs every 4 hours (at 6 AM, 10 AM, 2 PM, 6 PM, 10 PM, 2 AM)
node_cron_1.default.schedule('0 6,10,14,18,22,2 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Scheduled job triggered at ${new Date().toLocaleTimeString()}`);
    yield (0, IntervalWork_1.runJob)();
}));
console.log("Scheduled to run six times daily at fixed intervals (every 4 hours from 6 AM).");
app.post("/api/bot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const text = message === null || message === void 0 ? void 0 : message.text; // Get the text of the message
        const chat = message === null || message === void 0 ? void 0 : message.chat; // Get chat info
        const chatId = chat === null || chat === void 0 ? void 0 : chat.id; // Get chat ID
        const name = chat === null || chat === void 0 ? void 0 : chat.first_name; // Get chat name
        const command = text === null || text === void 0 ? void 0 : text.split(" ")[0]; // Get the command
        if (!text) {
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
                yield (0, sendRes_telegram_1.default)(chatId, responseText);
                res.status(200).json({ status: 'Message processed' });
                return;
            case "/search":
                if (!text.split(" ")[1]) {
                    yield (0, sendRes_telegram_1.default)(chatId, `⚠️ Oops! Please provide a word to search for! 🔍`);
                    res.status(200).json({ status: 'Message processed', meaning: "Please provide a word to search for!" });
                    return;
                }
                const meaning = yield (0, gemin_1.getMeaning)(text.split(" ")[1]);
                if (meaning) {
                    yield (0, sendRes_telegram_1.default)(chatId, meaning);
                    res.status(200).json({ status: 'Message processed', meaning });
                }
                else {
                    yield (0, sendRes_telegram_1.default)(chatId, `⚠️ Oops! I don't know this word! 🔍`);
                    res.status(200).json({ status: 'Message processed', meaning: "I don't know this word" });
                }
                return;
            case "/set":
                const addWord = yield (0, sqllite_1.addOrUpdateWord)(chatId, { text: text.split(" ")[1], timestamp: new Date().toISOString() }, name);
                if (addWord) {
                    yield (0, sendRes_telegram_1.default)(chatId, `✅ Word added to your list! 📚`);
                    res.status(200).json({ status: 'Message processed', addWord });
                }
                else {
                    yield (0, sendRes_telegram_1.default)(chatId, `⚠️ Oops! Something went wrong. Please try again! 🔄`);
                    res.status(200).json({ status: 'Message processed', addWord: false });
                }
                return;
            case "/rm":
                const deleteWord = yield (0, sqllite_1.deleteWordFromArray)(text.split(" ")[1], chatId);
                if (typeof deleteWord === "string") {
                    yield (0, sendRes_telegram_1.default)(chatId, deleteWord);
                    res.status(200).json({ status: 'Message processed', deleteWord });
                }
                else if (deleteWord) {
                    yield (0, sendRes_telegram_1.default)(chatId, `🗑️ Word removed from your list! 👍`);
                    res.status(200).json({ status: 'Message processed', deleteWord });
                }
                else {
                    yield (0, sendRes_telegram_1.default)(chatId, `⚠️ Oops! Something went wrong. Please try again! 🔄`);
                    res.status(200).json({ status: 'Message processed', deleteWord: false });
                }
                return;
            case "/list":
                const list = yield (0, sqllite_1.getWords)(chatId);
                if (list && list.length > 0) {
                    yield (0, sendRes_telegram_1.default)(chatId, `📝 Here’s your word list:\n${list.map((w, i) => `${i + 1}. ${w.text} ✨`).join("\n")}`);
                    res.status(200).json({ status: 'Message processed', list });
                }
                else {
                    yield (0, sendRes_telegram_1.default)(chatId, `😅 Oops! Your list is empty. Add some words to get started! 📚✨`);
                    res.status(200).json({ status: 'Message processed', list: [] });
                }
                return;
        }
        // Send the response back to the user
        const chatWithGeminRes = yield (0, chat_gemini_1.default)(text);
        if (chatWithGeminRes) {
            const result = yield (0, sendRes_telegram_1.default)(chatId, chatWithGeminRes);
            console.log('Wordler Bot🤖 is working fine', result);
        }
        else {
            yield (0, sendRes_telegram_1.default)(chatId, `⚠️ Oops! Something went wrong. Please try again! 🔄`);
        }
    }
    catch (error) {
        console.log('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    // Respond to Telegram's server
    res.status(200).json({ status: 'Message processed' });
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map