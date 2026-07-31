import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userModel from "./models/user.model.js";
import { Redis } from "ioredis";
import rateLimmiter from "./middlewares/rateLimitter.js";
import sendEmail from "./config/sendEmail.js";
import emailQueue from "./queue.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
export const redis = new Redis(process.env.REDIS_URL);

// API CHACHING

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Assalam O Alaikum" });
});

app.post("/create", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.create({ name, email, password });
    await redis.del("users:all");
    return res.status(200).json({ message: "User Created Sucessfully", user });
  } catch (error) {
    console.log(error.message);
  }
});
app.get("/get", async (req, res) => {
  try {
    const users = await userModel.find({});
    return res
      .status(200)
      .json({ message: "Sucessfully Fetched All Users", users });
  } catch (error) {
    console.log(error.message);
  }
});

// Rate Limitting

app.get("/get-with-redis", rateLimmiter, async (req, res) => {
  try {
    const chached = await redis.get("users:all");
    if (chached) {
      const data = JSON.parse(chached);
      return res.status(200).json({
        message: "Sucessfully Fetched All Users From Redis",
        users: data,
      });
    }
    const users = await userModel.find({});
    await redis.set("users:all", JSON.stringify(users));
    return res
      .status(200)
      .json({ message: "Sucessfully Fetched All Users", users });
  } catch (error) {
    console.log(error.message);
  }
});

// OTP - STORAGE

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(6000 + Math.random() * 1000).toString();
  const chachedOTP = await redis.set(`otp:${email}`, otp, "EX", 30);
  return res.status(201).json({ message: "OTP Sent Sucessfully", otp });
});
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const chachedOTP = await redis.get(`otp:${email}`);
  if (!chachedOTP) {
    return res.status(400).json({ message: "OTP Is Expired" });
  }
  if (otp != chachedOTP) {
    return res.status(400).json({ message: "OTP Is Expired OR Invalid" });
  }
  await redis.del(`otp:${email}`);
  return res.status(201).json({ message: "OTP verified Sucessfully", otp });
});

// Queue
app.post("/sign-up", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.create({ name, email, password });
    await redis.del("users:all");
    await emailQueue.add("send-email", { email });
    return res
      .status(200)
      .json({ message: "User Signed Up Sucessfully", user });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`Server Is Running On ${port}`);
});
