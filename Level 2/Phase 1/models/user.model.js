import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
