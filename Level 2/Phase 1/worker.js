import { Worker } from "bullmq";
import sendEmail from "./config/sendEmail.js";
import Redis from "ioredis";

const connection = new Redis("redis://localhost:6379", {
  maxRetriesPerRequest: null,
});
const worker = new Worker(
  "emailQueue",
  async (job) => {
    const email = job.data.email;
    console.log("Job Started");
    await sendEmail(email);
    console.log("Job Ended");
  },
  { connection },
);
