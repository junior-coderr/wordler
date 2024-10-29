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
const sqllite_1 = __importDefault(require("./sqllite"));
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const sendRes_telegram_1 = __importDefault(require("./sendRes_telegram"));
dotenv_1.default.config();
const getMeaning = (words) => __awaiter(void 0, void 0, void 0, function* () {
    const geminiKey = process.env.GEMINI_KEY;
    const prompt = `Provide the definitions and example sentences for each word in this list: [${words.join(", ")}]. Format each entry exactly like this: "1. word: definition. Example: example sentence." Ensure there are no symbols, including asterisks or any other formatting. For example:
  
  Example:
  1. good: morally excellent.
  Example: "She is a good person."

  2. nice: morally excellent.
  Example: "She is a nice person."

  Now provide definitions and examples for each word in the list in the same format, starting from 1.`;
    try {
        if (!geminiKey)
            return null;
        const genAI = new generative_ai_1.GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = yield model.generateContent(prompt);
        return result.response.text();
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
const sendRemainder = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = sqllite_1.default.prepare('SELECT * FROM users').all();
        users.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            const words = JSON.parse(user.words);
            const wordsText = words.map((word) => word.text);
            if (wordsText.length > 0) {
                const meaning = yield getMeaning(wordsText);
                const responseText = `Here are the meanings of the words you set as reminders: \n\n${meaning}`;
                const chatId = user.chatId;
                yield (0, sendRes_telegram_1.default)(chatId, responseText);
            }
        }));
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
sendRemainder();
exports.default = sendRemainder;
//# sourceMappingURL=sendRemainder.js.map