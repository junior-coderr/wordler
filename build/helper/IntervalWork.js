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
const startDailyRandomJobScheduler = () => {
    const maxExecutionsPerDay = 6;
    const startHour = 6; // 6 AM
    const endHour = 24; // Midnight
    // Function to execute the actual job
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
    // Schedule the next run within daytime hours
    const scheduleDailyJobs = () => {
        let executionCount = 0;
        const scheduleNextJob = () => {
            if (executionCount >= maxExecutionsPerDay) {
                console.log("Completed all scheduled executions for today.");
                return;
            }
            // Calculate a random interval within the next 2-5 hours
            const interval = (Math.floor(Math.random() * 4) + 2) * 60 * 60 * 1000; // 2-5 hours in milliseconds
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const now = new Date();
                const currentHour = now.getHours();
                // Only run if within allowed time frame
                if (currentHour >= startHour && currentHour < endHour) {
                    yield runJob();
                    executionCount++; // Increment the daily execution count
                    scheduleNextJob(); // Schedule the next job for today
                }
                else {
                    console.log("Outside of daytime hours. Waiting for next day.");
                    scheduleJobsForNextDay(); // Schedule jobs to start again at 6 AM the next day
                }
            }), interval);
        };
        // Start the first job
        scheduleNextJob();
    };
    // Schedule the jobs to begin at 6 AM the next day
    const scheduleJobsForNextDay = () => {
        const now = new Date();
        const firstRun = new Date();
        firstRun.setDate(now.getDate() + 1); // Set to tomorrow
        firstRun.setHours(startHour, 0, 0, 0); // Set time to 6 AM
        const delay = firstRun.getTime() - now.getTime();
        setTimeout(scheduleDailyJobs, delay); // Schedule the jobs for the next day at 6 AM
    };
    // Start scheduling immediately if it's within the allowed timeframe
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= startHour && currentHour < endHour) {
        console.log("Starting daily scheduler immediately.");
        scheduleDailyJobs();
    }
    else {
        console.log("Outside of daytime hours. Waiting until 6 AM tomorrow.");
        scheduleJobsForNextDay();
    }
};
console.log("Scheduling job to run 6 times daily at random intervals during daytime hours.");
exports.default = startDailyRandomJobScheduler;
//# sourceMappingURL=IntervalWork.js.map