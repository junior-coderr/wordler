"use strict";
// Answer the following question in one short sentence with relevant emojis. Do not use any symbols other than emojis. Keep it simple and clear.
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = chatWithGemin;
// Make sure to include these imports:
const generative_ai_1 = require("@google/generative-ai");
function chatWithGemin(question) {
  return __awaiter(this, void 0, void 0, function* () {
    const geminiKey = process.env.GEMINI_KEY;
    const prompt = `chat in one short sentence with relevant emojis and  words. Do not use any symbols other than emojis. Keep it simple and clear.
  Question: ${question}`;
    try {
      if (!geminiKey) return null;
      const genAI = new generative_ai_1.GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = yield model.generateContent(prompt);
      console.log(result.response.text(), "result");
      return result.response.text();
    } catch (error) {
      console.log("error in chatWithGemin", error);
      return null;
    }
  });
}
//# sourceMappingURL=chat_gemini.js.map
