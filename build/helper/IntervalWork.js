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
exports.runJob = void 0;
const sendRemainder_1 = __importDefault(require("./sendRemainder"));
// Function to execute the job
const runJob = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Job is running at ${new Date().toLocaleTimeString()}`);
    try {
        const res = yield (0, sendRemainder_1.default)();
        console.log("sendRemainder", res);
    }
    catch (error) {
        console.log("Error in sendRemainder", error);
    }
});
exports.runJob = runJob;
//# sourceMappingURL=IntervalWork.js.map