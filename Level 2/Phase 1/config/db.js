import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect To DB.");
  } catch (e) {
    console.log(e.message);
  }
};

export default connectDB;
