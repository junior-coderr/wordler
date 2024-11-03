import sendRemainder from "./sendRemainder";

const startDailyRandomJobScheduler = () => {
  const maxExecutionsPerDay = 6;
  const startHour = 6; // 6 AM
  const endHour = 24; // Midnight

  // Function to execute the actual job
  const runJob = async () => {
    console.log(`Job is running at ${new Date().toLocaleTimeString()}`);
    try {
      const res = await sendRemainder();
      console.log("sendRemainder", res);
    } catch (error) {
      console.log("Error in sendRemainder", error);
    }
  };

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

      setTimeout(async () => {
        const now = new Date();
        const currentHour = now.getHours();

        // Only run if within allowed time frame
        if (currentHour >= startHour && currentHour < endHour) {
          await runJob();
          executionCount++; // Increment the daily execution count
          scheduleNextJob(); // Schedule the next job for today
        } else {
          console.log("Outside of daytime hours. Waiting for next day.");
          scheduleJobsForNextDay(); // Schedule jobs to start again at 6 AM the next day
        }
      }, interval);
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
  } else {
    console.log("Outside of daytime hours. Waiting until 6 AM tomorrow.");
    scheduleJobsForNextDay();
  }
};

console.log("Scheduling job to run 6 times daily at random intervals during daytime hours.");

export default startDailyRandomJobScheduler;
