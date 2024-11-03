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
const sendRemainder_1 = __importDefault(require("./sendRemainder"));
const startRandomJobScheduler = () => {
    // Function to execute the actual job
    const runJob = (time) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Job is running at ${new Date().toLocaleTimeString()} at ${time}`);
        try {
            const res = yield (0, sendRemainder_1.default)();
            console.log('sendRemainder', res);
        }
        catch (error) {
            console.log('Error in sendRemainder', error);
        }
    });
    runJob(6);
    // Recursive function to schedule the next job after a random interval
    const scheduleNextJob = () => {
        // Calculate a random interval between 2 to 5 hours
        const interval = (Math.floor(Math.random() * 3) + 2) * 60 * 60 * 1000; // 2-5 hours in milliseconds
        // Schedule the job to run after the interval
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            const now = new Date();
            const currentHour = now.getHours();
            // Only run the job if it's within the allowed timeframe (6 AM - midnight)
            if (currentHour >= 6 && currentHour < 24) {
                yield runJob(currentHour);
                scheduleNextJob(); // Schedule the next job
            }
            else {
                console.log("Outside of the allowed time range. Waiting until 6 AM tomorrow.");
                scheduleFirstJobTomorrow(); // Wait until 6 AM the next day
            }
        }), interval);
    };
    // Function to schedule the first job at 6 AM
    const scheduleFirstJobTomorrow = () => {
        const now = new Date();
        const firstRun = new Date();
        firstRun.setDate(now.getDate() + 1); // Set to tomorrow
        firstRun.setHours(6, 0, 0, 0); // Set time to 6 AM
        const delay = firstRun.getTime() - now.getTime();
        setTimeout(scheduleNextJob, delay); // Schedule the first job at 6 AM
    };
    // Check current time and schedule the first job accordingly
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 6 && currentHour < 24) {
        console.log("Starting scheduler immediately.");
        // scheduleNextJob(); // Start immediately if it's between 6 AM and midnight
    }
    else {
        console.log("Outside of the allowed time range. Waiting until 6 AM tomorrow.");
        // scheduleFirstJobTomorrow(); // Otherwise, wait until 6 AM
    }
};
console.log("Scheduled task to run every 3rd day at 6 AM.");
exports.default = startRandomJobScheduler;
//# sourceMappingURL=IntervalWork.js.map