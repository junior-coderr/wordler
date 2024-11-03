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
exports.default = sendRes_telegram;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.env.BOT_TOKEN;
function sendRes_telegram(chatId, responseText) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('sendRes_telegram', chatId, responseText);
        try {
            const response = yield fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId, // Send to the chat ID
                    text: responseText, // Response text
                }),
            });
            const data = yield response.json();
            console.log('data', data);
            return true;
        }
        catch (error) {
            console.log('Error sending message:', error);
            return false;
        }
    });
}
//# sourceMappingURL=sendRes_telegram.js.map