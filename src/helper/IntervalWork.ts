import sendRemainder from "./sendRemainder";

const startRandomJobScheduler = () => {
  // Function to execute the actual job
  const runJob = async (time:number) => { 
    console.log(`Job is running at ${new Date().toLocaleTimeString()} at ${time}`);
    try{  
      const res =  await sendRemainder();
      console.log('sendRemainder',res);
    } catch (error) {
      console.log('Error in sendRemainder',error);
    }
  };

  // Recursive function to schedule the next job after a random interval
  const scheduleNextJob = () => {
    // Calculate a random interval between 2 to 5 hours
    const interval = (Math.floor(Math.random() * 3) + 2) * 60 * 60 * 1000; // 2-5 hours in milliseconds

    // Schedule the job to run after the interval
    setTimeout(async () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Only run the job if it's within the allowed timeframe (6 AM - midnight)
      if (currentHour >= 6 && currentHour < 24) {
        await runJob(currentHour);
        scheduleNextJob(); // Schedule the next job
      } else {
        console.log("Outside of the allowed time range. Waiting until 6 AM tomorrow.");
        scheduleFirstJobTomorrow(); // Wait until 6 AM the next day
      }
    }, interval);
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
    scheduleNextJob(); // Start immediately if it's between 6 AM and midnight
  } else {
    console.log("Outside of the allowed time range. Waiting until 6 AM tomorrow.");
    scheduleFirstJobTomorrow(); // Otherwise, wait until 6 AM
  }
};


console.log("Scheduled task to run every 3rd day at 6 AM.");



export default startRandomJobScheduler;
