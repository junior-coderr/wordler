import sendRemainder from './sendRemainder';


// Function to execute the job
export const runJob = async () => {
  console.log(`Job is running at ${new Date().toLocaleTimeString()}`);
  try {
    const res = await sendRemainder();
    console.log("sendRemainder", res);
  } catch (error) {
    console.log("Error in sendRemainder", error);
  }
};
