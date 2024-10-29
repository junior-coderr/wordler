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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeaning = void 0;
// Make sure to include these imports:
const generative_ai_1 = require("@google/generative-ai");
const getMeaning = (word) => __awaiter(void 0, void 0, void 0, function* () {
    const geminiKey = process.env.GEMINI_KEY;
    const prompt = `Provide only one clear definition and one example sentence for the word "${word}". Include emojis if possible. Format it exactly like this:

  word: the definition here.
  \n
  Example: an example sentence here.

  Do not add any additional meanings, symbols, and asterisks. Avoid any extra information adhere to the format strictly.`;
    try {
        if (!geminiKey)
            return null;
        const genAI = new generative_ai_1.GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = yield model.generateContent(prompt);
        console.log(result.response.text(), 'result');
        return result.response.text();
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.getMeaning = getMeaning;
//# sourceMappingURL=gemin.js.map